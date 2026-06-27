package main

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"sort"
	"strings"
	"unicode"
	"unicode/utf8"

	firebase "firebase.google.com/go/v4"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	collectionNameField   = "name"
	pieceComposerField    = "composer"
	partPDFField          = "pdf"
)

type collectionStore interface {
	ListUserCollection(ctx context.Context, email string) (userCollection, error)
	GetPartPDF(ctx context.Context, email, book, piece, part string) (string, error)
	SetPartPDF(ctx context.Context, email, book, piece, part, pdf string) error
	SetPiece(ctx context.Context, email, book, piece, name, composer string) error
	SetBook(ctx context.Context, email, book, name string) error
	DeletePiece(ctx context.Context, email, book, piece string) error
	DeleteBook(ctx context.Context, email, book string) error
}

type collectionPart struct {
	Name string `json:"name"`
	PDF  string `json:"pdf"`
}

type collectionPiece struct {
	Name     string           `json:"name"`
	Composer string           `json:"composer,omitempty"`
	Parts    []collectionPart `json:"parts"`
}

type collectionBook struct {
	Name   string            `json:"name"`
	Pieces []collectionPiece `json:"pieces"`
}

type userCollection struct {
	Books []collectionBook `json:"books"`
}

type firestoreCollectionStore struct {
	client *firestore.Client
}

func newFirestoreCollectionStore(ctx context.Context, fbApp *firebase.App) (*firestoreCollectionStore, error) {
	client, err := fbApp.Firestore(ctx)
	if err != nil {
		return nil, err
	}
	return &firestoreCollectionStore{client: client}, nil
}

func (s *firestoreCollectionStore) booksCollection(email string) *firestore.CollectionRef {
	return s.client.Collection("users").Doc(collectionEmail(email)).Collection("books")
}

func (s *firestoreCollectionStore) bookRef(email, book string) *firestore.DocumentRef {
	return s.booksCollection(email).Doc(collectionDocID(book))
}

func (s *firestoreCollectionStore) resolveBookRef(ctx context.Context, email, book string) (*firestore.DocumentRef, error) {
	book = strings.TrimSpace(book)
	if book == "" {
		return nil, errors.New("missing book")
	}

	booksCol := s.booksCollection(email)
	direct := booksCol.Doc(collectionDocID(book))
	snap, err := direct.Get(ctx)
	if err == nil {
		if strings.EqualFold(collectionDisplayName(snap), book) {
			return direct, nil
		}
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}

	iter := booksCol.Where(collectionNameField, "==", book).Limit(1).Documents(ctx)
	defer iter.Stop()

	doc, err := iter.Next()
	if errors.Is(err, iterator.Done) {
		return nil, errNotFound
	}
	if err != nil {
		return nil, err
	}
	return doc.Ref, nil
}

func (s *firestoreCollectionStore) bookRefForWrite(ctx context.Context, email, book string) (*firestore.DocumentRef, error) {
	ref, err := s.resolveBookRef(ctx, email, book)
	if err == nil {
		return ref, nil
	}
	if errors.Is(err, errNotFound) {
		return s.bookRef(email, book), nil
	}
	return nil, err
}

func (s *firestoreCollectionStore) pieceRef(email, book, piece string) *firestore.DocumentRef {
	return s.bookRef(email, book).
		Collection("piece").Doc(collectionDocID(piece))
}

func (s *firestoreCollectionStore) resolvePieceRef(ctx context.Context, email, book, piece string) (*firestore.DocumentRef, error) {
	piece = strings.TrimSpace(piece)
	if piece == "" {
		return nil, errors.New("missing piece")
	}

	bookRef, err := s.bookRefForWrite(ctx, email, book)
	if err != nil {
		return nil, err
	}
	direct := bookRef.Collection("piece").Doc(collectionDocID(piece))
	snap, err := direct.Get(ctx)
	if err == nil {
		if strings.EqualFold(collectionDisplayName(snap), piece) {
			return direct, nil
		}
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}

	iter := bookRef.Collection("piece").Where(collectionNameField, "==", piece).Limit(1).Documents(ctx)
	defer iter.Stop()

	doc, err := iter.Next()
	if errors.Is(err, iterator.Done) {
		return nil, errNotFound
	}
	if err != nil {
		return nil, err
	}
	return doc.Ref, nil
}

func (s *firestoreCollectionStore) pieceRefForWrite(ctx context.Context, email, book, piece string) (*firestore.DocumentRef, error) {
	ref, err := s.resolvePieceRef(ctx, email, book, piece)
	if err == nil {
		return ref, nil
	}
	if errors.Is(err, errNotFound) {
		return s.pieceRef(email, book, piece), nil
	}
	return nil, err
}

func (s *firestoreCollectionStore) partRef(ctx context.Context, email, book, piece, part string) (*firestore.DocumentRef, error) {
	pieceRef, err := s.pieceRefForWrite(ctx, email, book, piece)
	if err != nil {
		return nil, err
	}
	return pieceRef.Collection("parts").Doc(collectionDocID(part)), nil
}

func (s *firestoreCollectionStore) GetPartPDF(ctx context.Context, email, book, piece, part string) (string, error) {
	partRef, err := s.partRef(ctx, email, book, piece, part)
	if err != nil {
		return "", err
	}
	snap, err := partRef.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return "", errNotFound
		}
		return "", err
	}
	return pdfFromSnapshot(snap)
}

func (s *firestoreCollectionStore) SetPartPDF(ctx context.Context, email, book, piece, part, pdf string) error {
	bookRef, err := s.bookRefForWrite(ctx, email, book)
	if err != nil {
		return err
	}
	pieceRef, err := s.pieceRefForWrite(ctx, email, book, piece)
	if err != nil {
		return err
	}
	partRef := pieceRef.Collection("parts").Doc(collectionDocID(part))

	batch := s.client.Batch()
	batch.Set(bookRef, map[string]any{
		collectionNameField: book,
	}, firestore.MergeAll)
	batch.Set(pieceRef, map[string]any{
		collectionNameField: piece,
	}, firestore.MergeAll)
	batch.Set(partRef, map[string]any{
		collectionNameField: part,
		partPDFField: pdf,
	}, firestore.MergeAll)
	_, err = batch.Commit(ctx)
	return err
}

func (s *firestoreCollectionStore) SetPiece(ctx context.Context, email, book, piece, name, composer string) error {
	bookRef, err := s.bookRefForWrite(ctx, email, book)
	if err != nil {
		return err
	}
	pieceRef, err := s.resolvePieceRef(ctx, email, book, piece)
	if err != nil {
		return err
	}

	batch := s.client.Batch()
	batch.Set(bookRef, map[string]any{
		collectionNameField: book,
	}, firestore.MergeAll)
	batch.Set(pieceRef, map[string]any{
		collectionNameField: name,
		pieceComposerField:  composer,
	}, firestore.MergeAll)
	_, err = batch.Commit(ctx)
	return err
}

func (s *firestoreCollectionStore) SetBook(ctx context.Context, email, book, name string) error {
	bookRef, err := s.resolveBookRef(ctx, email, book)
	if err != nil {
		return err
	}
	_, err = bookRef.Set(ctx, map[string]any{
		collectionNameField: name,
	}, firestore.MergeAll)
	return err
}

func (s *firestoreCollectionStore) deleteDocuments(ctx context.Context, col *firestore.CollectionRef) error {
	iter := col.Documents(ctx)
	defer iter.Stop()

	batch := s.client.Batch()
	count := 0
	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return err
		}
		batch.Delete(doc.Ref)
		count++
		if count >= 400 {
			if _, err := batch.Commit(ctx); err != nil {
				return err
			}
			batch = s.client.Batch()
			count = 0
		}
	}
	if count > 0 {
		_, err := batch.Commit(ctx)
		return err
	}
	return nil
}

func (s *firestoreCollectionStore) DeletePiece(ctx context.Context, email, book, piece string) error {
	pieceRef, err := s.resolvePieceRef(ctx, email, book, piece)
	if err != nil {
		return err
	}
	if err := s.deleteDocuments(ctx, pieceRef.Collection("parts")); err != nil {
		return err
	}
	_, err = pieceRef.Delete(ctx)
	return err
}

func (s *firestoreCollectionStore) DeleteBook(ctx context.Context, email, book string) error {
	bookRef, err := s.resolveBookRef(ctx, email, book)
	if err != nil {
		return err
	}

	piecesIter := bookRef.Collection("piece").Documents(ctx)
	defer piecesIter.Stop()
	for {
		pieceDoc, err := piecesIter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return err
		}
		if err := s.deleteDocuments(ctx, pieceDoc.Ref.Collection("parts")); err != nil {
			return err
		}
		if _, err := pieceDoc.Ref.Delete(ctx); err != nil {
			return err
		}
	}

	_, err = bookRef.Delete(ctx)
	return err
}

func (s *firestoreCollectionStore) ListUserCollection(ctx context.Context, email string) (userCollection, error) {
	booksIter := s.client.Collection("users").Doc(collectionEmail(email)).Collection("books").Documents(ctx)
	defer booksIter.Stop()

	var books []collectionBook
	for {
		bookDoc, err := booksIter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return userCollection{}, err
		}

		pieces, err := s.listCollectionPieces(ctx, bookDoc.Ref)
		if err != nil {
			return userCollection{}, err
		}
		books = append(books, collectionBook{
			Name:   collectionDisplayName(bookDoc),
			Pieces: pieces,
		})
	}

	sortCollectionBooks(books)
	if books == nil {
		books = []collectionBook{}
	}
	return userCollection{Books: books}, nil
}

func (s *firestoreCollectionStore) listCollectionPieces(ctx context.Context, bookRef *firestore.DocumentRef) ([]collectionPiece, error) {
	piecesIter := bookRef.Collection("piece").Documents(ctx)
	defer piecesIter.Stop()

	var pieces []collectionPiece
	for {
		pieceDoc, err := piecesIter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}

		parts, err := s.listCollectionParts(ctx, pieceDoc.Ref)
		if err != nil {
			return nil, err
		}
		pieces = append(pieces, collectionPiece{
			Name:     collectionDisplayName(pieceDoc),
			Composer: composerFromSnapshot(pieceDoc),
			Parts:    parts,
		})
	}

	sortCollectionPieces(pieces)
	if pieces == nil {
		pieces = []collectionPiece{}
	}
	return pieces, nil
}

func (s *firestoreCollectionStore) listCollectionParts(ctx context.Context, pieceRef *firestore.DocumentRef) ([]collectionPart, error) {
	partsIter := pieceRef.Collection("parts").Documents(ctx)
	defer partsIter.Stop()

	var parts []collectionPart
	for {
		partDoc, err := partsIter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}

		pdf, err := pdfFromSnapshot(partDoc)
		if errors.Is(err, errNotFound) {
			continue
		}
		if err != nil {
			return nil, err
		}
		parts = append(parts, collectionPart{
			Name: collectionDisplayName(partDoc),
			PDF:  pdf,
		})
	}

	sortCollectionParts(parts)
	if parts == nil {
		parts = []collectionPart{}
	}
	return parts, nil
}

func sortCollectionBooks(books []collectionBook) {
	sort.Slice(books, func(i, j int) bool {
		return books[i].Name < books[j].Name
	})
}

func sortCollectionPieces(pieces []collectionPiece) {
	sort.Slice(pieces, func(i, j int) bool {
		return pieces[i].Name < pieces[j].Name
	})
}

func sortCollectionParts(parts []collectionPart) {
	sort.Slice(parts, func(i, j int) bool {
		return parts[i].Name < parts[j].Name
	})
}

func pdfFromSnapshot(snap *firestore.DocumentSnapshot) (string, error) {
	pdf, ok := snap.Data()[partPDFField].(string)
	if !ok {
		return "", errNotFound
	}
	pdf = strings.TrimSpace(pdf)
	if pdf == "" {
		return "", errNotFound
	}
	return pdf, nil
}

func collectionDisplayName(snap *firestore.DocumentSnapshot) string {
	name, _ := snap.Data()[collectionNameField].(string)
	name = strings.TrimSpace(name)
	if name != "" {
		return name
	}
	return snap.Ref.ID
}

func composerFromSnapshot(snap *firestore.DocumentSnapshot) string {
	composer, _ := snap.Data()[pieceComposerField].(string)
	return strings.TrimSpace(composer)
}

func collectionEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func collectionDocID(name string) string {
	name = strings.TrimSpace(name)
	sum := sha256.Sum256([]byte(name))
	return fmt.Sprintf("%s-%x", collectionSlug(name), sum[:6])
}

func collectionSlug(name string) string {
	var b strings.Builder
	lastDash := false
	for _, r := range strings.ToLower(name) {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			if b.Len() < 72 {
				b.WriteRune(r)
			}
			lastDash = false
			continue
		}
		if !lastDash && b.Len() > 0 && b.Len() < 72 {
			b.WriteByte('-')
			lastDash = true
		}
	}
	slug := strings.Trim(b.String(), "-")
	if slug == "" {
		return "item"
	}
	return slug
}

// validateCollectionSegment checks that a book/piece/part name is a usable
// collection display name. It will be stored in the document's "name" field;
// the Firestore document ID is derived separately by collectionDocID.
func validateCollectionSegment(name, label string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return errors.New("missing " + label)
	}
	if len(name) > 1500 {
		return errors.New(label + " is too long")
	}
	if name == "." || name == ".." {
		return errors.New("invalid " + label)
	}
	if strings.HasPrefix(name, "__") && strings.HasSuffix(name, "__") {
		return errors.New("invalid " + label)
	}
	if strings.ContainsAny(name, "/\\") {
		return errors.New("invalid " + label)
	}
	if !utf8.ValidString(name) {
		return errors.New("invalid " + label)
	}
	for _, r := range name {
		if r == '\uFFFD' || (unicode.IsControl(r) && r != '\t') {
			return errors.New("invalid " + label)
		}
	}
	return nil
}

func validateComposer(composer string) error {
	composer = strings.TrimSpace(composer)
	if composer == "" {
		return nil
	}
	if len(composer) > 500 {
		return errors.New("composer is too long")
	}
	if !utf8.ValidString(composer) {
		return errors.New("invalid composer")
	}
	for _, r := range composer {
		if r == '\uFFFD' || (unicode.IsControl(r) && r != '\t') {
			return errors.New("invalid composer")
		}
	}
	return nil
}

type partPDFRequest struct {
	PDF string `json:"pdf"`
}

type pieceUpdateRequest struct {
	Name     string `json:"name"`
	Composer string `json:"composer"`
}

type bookUpdateRequest struct {
	Name string `json:"name"`
}

func (s *server) handleGetUserCollection(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	collection, err := s.collections.ListUserCollection(r.Context(), pathEmail)
	if err != nil {
		log.Printf("collection list failed email=%q err=%v", pathEmail, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read collection"})
		return
	}

	log.Printf("collection list email=%q books=%d", pathEmail, len(collection.Books))
	writeJSON(w, http.StatusOK, collection)
}

func (s *server) handleGetCollectionPart(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	book := bookParam(r, "book")
	piece := bookParam(r, "piece")
	part := bookParam(r, "part")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(book, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(piece, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(part, "part"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	pdf, err := s.collections.GetPartPDF(r.Context(), pathEmail, book, piece, part)
	if err != nil {
		if errors.Is(err, errNotFound) {
			log.Printf("collection part not found email=%q book=%q piece=%q part=%q", pathEmail, book, piece, part)
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "part not found"})
			return
		}
		log.Printf("collection get failed email=%q book=%q piece=%q part=%q err=%v", pathEmail, book, piece, part, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read collection part"})
		return
	}

	log.Printf("collection get email=%q book=%q piece=%q part=%q pdf=%q", pathEmail, book, piece, part, pdf)
	writeJSON(w, http.StatusOK, map[string]string{"pdf": pdf})
}

func (s *server) handlePostCollectionPart(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	book := bookParam(r, "book")
	piece := bookParam(r, "piece")
	part := bookParam(r, "part")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(book, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(piece, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(part, "part"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	body := http.MaxBytesReader(w, r.Body, 4096)
	defer body.Close()

	var req partPDFRequest
	if err := json.NewDecoder(body).Decode(&req); err != nil && !errors.Is(err, io.EOF) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json body"})
		return
	}
	pdf := strings.TrimSpace(req.PDF)
	if err := validateBookFilename(pdf); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	if err := s.collections.SetPartPDF(r.Context(), pathEmail, book, piece, part, pdf); err != nil {
		log.Printf("collection set failed email=%q book=%q piece=%q part=%q pdf=%q err=%v", pathEmail, book, piece, part, pdf, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save collection part"})
		return
	}

	log.Printf("collection set email=%q book=%q piece=%q part=%q pdf=%q", pathEmail, book, piece, part, pdf)
	writeJSON(w, http.StatusCreated, map[string]string{"pdf": pdf})
}

func (s *server) handlePostCollectionPiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	book := bookParam(r, "book")
	piece := bookParam(r, "piece")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(book, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(piece, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	body := http.MaxBytesReader(w, r.Body, 4096)
	defer body.Close()

	var req pieceUpdateRequest
	if err := json.NewDecoder(body).Decode(&req); err != nil && !errors.Is(err, io.EOF) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json body"})
		return
	}
	name := strings.TrimSpace(req.Name)
	if name == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing name"})
		return
	}
	if err := validateCollectionSegment(name, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	composer := strings.TrimSpace(req.Composer)
	if err := validateComposer(composer); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	if err := s.collections.SetPiece(r.Context(), pathEmail, book, piece, name, composer); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "piece not found"})
			return
		}
		log.Printf("collection piece update failed email=%q book=%q piece=%q name=%q composer=%q err=%v", pathEmail, book, piece, name, composer, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save piece"})
		return
	}

	log.Printf("collection piece update email=%q book=%q piece=%q name=%q composer=%q", pathEmail, book, piece, name, composer)
	writeJSON(w, http.StatusOK, map[string]string{"name": name, "composer": composer})
}

func (s *server) handlePostCollectionBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	book := bookParam(r, "book")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(book, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	body := http.MaxBytesReader(w, r.Body, 4096)
	defer body.Close()

	var req bookUpdateRequest
	if err := json.NewDecoder(body).Decode(&req); err != nil && !errors.Is(err, io.EOF) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json body"})
		return
	}
	name := strings.TrimSpace(req.Name)
	if name == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing name"})
		return
	}
	if err := validateCollectionSegment(name, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	if err := s.collections.SetBook(r.Context(), pathEmail, book, name); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "book not found"})
			return
		}
		log.Printf("collection book update failed email=%q book=%q name=%q err=%v", pathEmail, book, name, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save book"})
		return
	}

	log.Printf("collection book update email=%q book=%q name=%q", pathEmail, book, name)
	writeJSON(w, http.StatusOK, map[string]string{"name": name})
}

func (s *server) handleDeleteCollectionPiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	book := bookParam(r, "book")
	piece := bookParam(r, "piece")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(book, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(piece, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.DeletePiece(r.Context(), pathEmail, book, piece); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "piece not found"})
			return
		}
		log.Printf("collection piece delete failed email=%q book=%q piece=%q err=%v", pathEmail, book, piece, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete piece"})
		return
	}

	log.Printf("collection piece delete email=%q book=%q piece=%q", pathEmail, book, piece)
	w.WriteHeader(http.StatusNoContent)
}

func (s *server) handleDeleteCollectionBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	book := bookParam(r, "book")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(book, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.DeleteBook(r.Context(), pathEmail, book); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "book not found"})
			return
		}
		log.Printf("collection book delete failed email=%q book=%q err=%v", pathEmail, book, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete book"})
		return
	}

	log.Printf("collection book delete email=%q book=%q", pathEmail, book)
	w.WriteHeader(http.StatusNoContent)
}
