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
	"time"
	"unicode"
	"unicode/utf8"

	firebase "firebase.google.com/go/v4"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	fieldName     = "name"
	fieldComposer = "composer"
	fieldPart     = "part"
	fieldPDF      = "pdf"
	fieldPieceIDs = "pieceIds"
	fieldPieceID  = "pieceId"
)

type collectionStore interface {
	ListUserLibrary(ctx context.Context, email string) (userLibrary, error)
	CreatePiece(ctx context.Context, email string, piece userPiece) (userPiece, error)
	UpdatePiece(ctx context.Context, email, pieceKey string, piece userPiece) (userPiece, error)
	DeletePiece(ctx context.Context, email, pieceKey string) error
	CreateBook(ctx context.Context, email, name string) (userBook, error)
	UpdateBook(ctx context.Context, email, bookKey, name string) (userBook, error)
	DeleteBook(ctx context.Context, email, bookKey string) error
	AddPieceToBook(ctx context.Context, email, bookKey, pieceKey string) error
	RemovePieceFromBook(ctx context.Context, email, bookKey, pieceKey string) error
	CreateSubpart(ctx context.Context, email, pieceKey string, subpart userSubpart) (userSubpart, error)
	DeleteSubpart(ctx context.Context, email, pieceKey, subpartKey string) error
}

type userPiece struct {
	ID       string        `json:"id"`
	Name     string        `json:"name"`
	Composer string        `json:"composer,omitempty"`
	Part     string        `json:"part,omitempty"`
	PDF      string        `json:"pdf"`
	Subparts []userSubpart `json:"subparts,omitempty"`
}

type userBook struct {
	ID     string      `json:"id"`
	Name   string      `json:"name"`
	Pieces []userPiece `json:"pieces"`
}

type userLibrary struct {
	Pieces []userPiece `json:"pieces"`
	Books  []userBook  `json:"books"`
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

func (s *firestoreCollectionStore) userRef(email string) *firestore.DocumentRef {
	return s.client.Collection("users").Doc(collectionEmail(email))
}

func (s *firestoreCollectionStore) piecesCollection(email string) *firestore.CollectionRef {
	return s.userRef(email).Collection("pieces")
}

func (s *firestoreCollectionStore) booksCollection(email string) *firestore.CollectionRef {
	return s.userRef(email).Collection("books")
}

func (s *firestoreCollectionStore) subpartsCollection(email string) *firestore.CollectionRef {
	return s.userRef(email).Collection("subparts")
}

func (s *firestoreCollectionStore) pieceRef(email, piece string) *firestore.DocumentRef {
	return s.piecesCollection(email).Doc(collectionDocID(piece))
}

func (s *firestoreCollectionStore) bookRef(email, book string) *firestore.DocumentRef {
	return s.booksCollection(email).Doc(collectionDocID(book))
}

func (s *firestoreCollectionStore) resolvePieceRef(ctx context.Context, email, piece string) (*firestore.DocumentRef, error) {
	piece = strings.TrimSpace(piece)
	if piece == "" {
		return nil, errors.New("missing piece")
	}

	piecesCol := s.piecesCollection(email)

	direct := piecesCol.Doc(piece)
	if _, err := direct.Get(ctx); err == nil {
		return direct, nil
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}

	bySlug := piecesCol.Doc(collectionDocID(piece))
	if snap, err := bySlug.Get(ctx); err == nil {
		if strings.EqualFold(collectionDisplayName(snap), piece) {
			return bySlug, nil
		}
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}

	iter := piecesCol.Where(fieldName, "==", piece).Limit(1).Documents(ctx)
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

func (s *firestoreCollectionStore) resolveBookRef(ctx context.Context, email, book string) (*firestore.DocumentRef, error) {
	book = strings.TrimSpace(book)
	if book == "" {
		return nil, errors.New("missing book")
	}

	booksCol := s.booksCollection(email)

	direct := booksCol.Doc(book)
	if _, err := direct.Get(ctx); err == nil {
		return direct, nil
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}

	bySlug := booksCol.Doc(collectionDocID(book))
	if snap, err := bySlug.Get(ctx); err == nil {
		if strings.EqualFold(collectionDisplayName(snap), book) {
			return bySlug, nil
		}
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}

	iter := booksCol.Where(fieldName, "==", book).Limit(1).Documents(ctx)
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

func pieceFromSnapshot(snap *firestore.DocumentSnapshot) userPiece {
	data := snap.Data()
	return userPiece{
		ID:       snap.Ref.ID,
		Name:     stringField(data, fieldName, snap.Ref.ID),
		Composer: stringField(data, fieldComposer, ""),
		Part:     stringField(data, fieldPart, ""),
		PDF:      stringField(data, fieldPDF, ""),
	}
}

func bookFromSnapshot(snap *firestore.DocumentSnapshot, piecesByID map[string]userPiece) userBook {
	data := snap.Data()
	book := userBook{
		ID:   snap.Ref.ID,
		Name: stringField(data, fieldName, snap.Ref.ID),
	}

	for _, id := range pieceIDsFromSnapshot(snap) {
		if piece, ok := piecesByID[id]; ok {
			book.Pieces = append(book.Pieces, piece)
		}
	}
	if book.Pieces == nil {
		book.Pieces = []userPiece{}
	}
	sortPieces(book.Pieces)
	return book
}

func pieceIDsFromSnapshot(snap *firestore.DocumentSnapshot) []string {
	raw, ok := snap.Data()[fieldPieceIDs]
	if !ok {
		return nil
	}
	switch ids := raw.(type) {
	case []string:
		return append([]string(nil), ids...)
	case []any:
		var out []string
		for _, item := range ids {
			if id, ok := item.(string); ok && strings.TrimSpace(id) != "" {
				out = append(out, id)
			}
		}
		return out
	default:
		return nil
	}
}

func stringField(data map[string]any, key, fallback string) string {
	value, _ := data[key].(string)
	value = strings.TrimSpace(value)
	if value != "" {
		return value
	}
	return fallback
}

func (s *firestoreCollectionStore) listPieces(ctx context.Context, email string) ([]userPiece, error) {
	queryStart := time.Now()
	iter := s.piecesCollection(email).Documents(ctx)
	defer iter.Stop()

	var pieces []userPiece
	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}
		pieces = append(pieces, pieceFromSnapshot(doc))
	}
	pieceQueryDuration := time.Since(queryStart)
	sortPieces(pieces)

	subpartsStart := time.Now()
	subpartsByPiece, err := s.listAllSubparts(ctx, email)
	if err != nil {
		return nil, err
	}
	for i, piece := range pieces {
		subparts := subpartsByPiece[piece.ID]
		if subparts == nil {
			subparts = []userSubpart{}
		}
		pieces[i].Subparts = subparts
	}
	log.Printf(
		"library timing phase=listPieces email=%q pieces=%d pieceQuery=%s subpartQuery=%s subparts=%d",
		email, len(pieces), pieceQueryDuration, time.Since(subpartsStart), countSubparts(subpartsByPiece),
	)

	if pieces == nil {
		pieces = []userPiece{}
	}
	return pieces, nil
}

func countSubparts(byPiece map[string][]userSubpart) int {
	n := 0
	for _, subparts := range byPiece {
		n += len(subparts)
	}
	return n
}

func (s *firestoreCollectionStore) ListUserLibrary(ctx context.Context, email string) (userLibrary, error) {
	totalStart := time.Now()

	piecesStart := time.Now()
	pieces, err := s.listPieces(ctx, email)
	if err != nil {
		return userLibrary{}, err
	}
	piecesPhase := time.Since(piecesStart)

	piecesByID := make(map[string]userPiece, len(pieces))
	for _, piece := range pieces {
		piecesByID[piece.ID] = piece
	}

	booksStart := time.Now()
	iter := s.booksCollection(email).Documents(ctx)
	defer iter.Stop()

	var books []userBook
	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return userLibrary{}, err
		}
		books = append(books, bookFromSnapshot(doc, piecesByID))
	}
	booksPhase := time.Since(booksStart)
	sortBooks(books)
	if books == nil {
		books = []userBook{}
	}

	log.Printf(
		"library timing phase=ListUserLibrary email=%q pieces=%d books=%d piecesPhase=%s booksPhase=%s total=%s",
		email, len(pieces), len(books), piecesPhase, booksPhase, time.Since(totalStart),
	)

	return userLibrary{Pieces: pieces, Books: books}, nil
}

func (s *firestoreCollectionStore) CreatePiece(ctx context.Context, email string, piece userPiece) (userPiece, error) {
	ref := s.pieceRef(email, piece.Name)
	_, err := ref.Set(ctx, map[string]any{
		fieldName:     piece.Name,
		fieldComposer: piece.Composer,
		fieldPart:     piece.Part,
		fieldPDF:      piece.PDF,
	})
	if err != nil {
		return userPiece{}, err
	}
	snap, err := ref.Get(ctx)
	if err != nil {
		return userPiece{}, err
	}
	return pieceFromSnapshot(snap), nil
}

func (s *firestoreCollectionStore) UpdatePiece(ctx context.Context, email, pieceKey string, piece userPiece) (userPiece, error) {
	ref, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return userPiece{}, err
	}
	_, err = ref.Set(ctx, map[string]any{
		fieldName:     piece.Name,
		fieldComposer: piece.Composer,
		fieldPart:     piece.Part,
		fieldPDF:      piece.PDF,
	}, firestore.MergeAll)
	if err != nil {
		return userPiece{}, err
	}
	snap, err := ref.Get(ctx)
	if err != nil {
		return userPiece{}, err
	}
	return pieceFromSnapshot(snap), nil
}

func (s *firestoreCollectionStore) removePieceFromAllBooks(ctx context.Context, email, pieceID string) error {
	iter := s.booksCollection(email).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			return nil
		}
		if err != nil {
			return err
		}
		ids := pieceIDsFromSnapshot(doc)
		if !containsString(ids, pieceID) {
			continue
		}
		next := removeString(ids, pieceID)
		if _, err := doc.Ref.Update(ctx, []firestore.Update{{Path: fieldPieceIDs, Value: next}}); err != nil {
			return err
		}
	}
}

func (s *firestoreCollectionStore) DeletePiece(ctx context.Context, email, pieceKey string) error {
	ref, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return err
	}
	if err := s.removePieceFromAllBooks(ctx, email, ref.ID); err != nil {
		return err
	}
	if err := s.deleteSubpartsForPiece(ctx, email, ref.ID); err != nil {
		return err
	}
	_, err = ref.Delete(ctx)
	return err
}

func (s *firestoreCollectionStore) CreateBook(ctx context.Context, email, name string) (userBook, error) {
	ref := s.bookRef(email, name)
	_, err := ref.Set(ctx, map[string]any{
		fieldName:     name,
		fieldPieceIDs: []string{},
	})
	if err != nil {
		return userBook{}, err
	}
	snap, err := ref.Get(ctx)
	if err != nil {
		return userBook{}, err
	}
	return bookFromSnapshot(snap, map[string]userPiece{}), nil
}

func (s *firestoreCollectionStore) UpdateBook(ctx context.Context, email, bookKey, name string) (userBook, error) {
	ref, err := s.resolveBookRef(ctx, email, bookKey)
	if err != nil {
		return userBook{}, err
	}
	_, err = ref.Set(ctx, map[string]any{
		fieldName: name,
	}, firestore.MergeAll)
	if err != nil {
		return userBook{}, err
	}

	pieces, err := s.listPieces(ctx, email)
	if err != nil {
		return userBook{}, err
	}
	piecesByID := make(map[string]userPiece, len(pieces))
	for _, piece := range pieces {
		piecesByID[piece.ID] = piece
	}
	snap, err := ref.Get(ctx)
	if err != nil {
		return userBook{}, err
	}
	return bookFromSnapshot(snap, piecesByID), nil
}

func (s *firestoreCollectionStore) DeleteBook(ctx context.Context, email, bookKey string) error {
	ref, err := s.resolveBookRef(ctx, email, bookKey)
	if err != nil {
		return err
	}
	_, err = ref.Delete(ctx)
	return err
}

func (s *firestoreCollectionStore) AddPieceToBook(ctx context.Context, email, bookKey, pieceKey string) error {
	bookRef, err := s.bookRefForWrite(ctx, email, bookKey)
	if err != nil {
		return err
	}
	pieceRef, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return err
	}

	snap, err := bookRef.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			name := strings.TrimSpace(bookKey)
			_, err = bookRef.Set(ctx, map[string]any{
				fieldName:     name,
				fieldPieceIDs: []string{pieceRef.ID},
			})
			return err
		}
		return err
	}

	ids := pieceIDsFromSnapshot(snap)
	if containsString(ids, pieceRef.ID) {
		return nil
	}
	ids = append(ids, pieceRef.ID)
	_, err = bookRef.Update(ctx, []firestore.Update{{Path: fieldPieceIDs, Value: ids}})
	return err
}

func (s *firestoreCollectionStore) RemovePieceFromBook(ctx context.Context, email, bookKey, pieceKey string) error {
	bookRef, err := s.resolveBookRef(ctx, email, bookKey)
	if err != nil {
		return err
	}
	pieceRef, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return err
	}

	snap, err := bookRef.Get(ctx)
	if err != nil {
		return err
	}
	ids := removeString(pieceIDsFromSnapshot(snap), pieceRef.ID)
	_, err = bookRef.Update(ctx, []firestore.Update{{Path: fieldPieceIDs, Value: ids}})
	return err
}

func sortBooks(books []userBook) {
	sort.Slice(books, func(i, j int) bool {
		return books[i].Name < books[j].Name
	})
}

func sortPieces(pieces []userPiece) {
	sort.Slice(pieces, func(i, j int) bool {
		return pieces[i].Name < pieces[j].Name
	})
}

func containsString(items []string, target string) bool {
	for _, item := range items {
		if item == target {
			return true
		}
	}
	return false
}

func removeString(items []string, target string) []string {
	out := make([]string, 0, len(items))
	for _, item := range items {
		if item != target {
			out = append(out, item)
		}
	}
	return out
}

func collectionDisplayName(snap *firestore.DocumentSnapshot) string {
	return stringField(snap.Data(), fieldName, snap.Ref.ID)
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

func validateOptionalText(value, label string, maxLen int) error {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil
	}
	if len(value) > maxLen {
		return errors.New(label + " is too long")
	}
	if !utf8.ValidString(value) {
		return errors.New("invalid " + label)
	}
	for _, r := range value {
		if r == '\uFFFD' || (unicode.IsControl(r) && r != '\t') {
			return errors.New("invalid " + label)
		}
	}
	return nil
}

type pieceRequest struct {
	Name     string `json:"name"`
	Composer string `json:"composer"`
	Part     string `json:"part"`
	PDF      string `json:"pdf"`
}

type bookRequest struct {
	Name string `json:"name"`
}

func decodeJSONBody(w http.ResponseWriter, r *http.Request, dst any) bool {
	body := http.MaxBytesReader(w, r.Body, 4096)
	defer body.Close()
	if err := json.NewDecoder(body).Decode(dst); err != nil && !errors.Is(err, io.EOF) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json body"})
		return false
	}
	return true
}

func parsePieceRequest(w http.ResponseWriter, req pieceRequest, requirePDF bool) (userPiece, bool) {
	name := strings.TrimSpace(req.Name)
	if name == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing name"})
		return userPiece{}, false
	}
	if err := validateCollectionSegment(name, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return userPiece{}, false
	}
	composer := strings.TrimSpace(req.Composer)
	if err := validateOptionalText(composer, "composer", 500); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return userPiece{}, false
	}
	part := strings.TrimSpace(req.Part)
	if err := validateOptionalText(part, "part", 500); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return userPiece{}, false
	}
	pdf := strings.TrimSpace(req.PDF)
	if requirePDF {
		if err := validateBookFilename(pdf); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return userPiece{}, false
		}
	} else if pdf != "" {
		if err := validateBookFilename(pdf); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return userPiece{}, false
		}
	}

	return userPiece{
		Name:     name,
		Composer: composer,
		Part:     part,
		PDF:      pdf,
	}, true
}

func (s *server) handleGetUserLibrary(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	library, err := s.collections.ListUserLibrary(r.Context(), pathEmail)
	if err != nil {
		log.Printf("library list failed email=%q err=%v", pathEmail, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read library"})
		return
	}

	log.Printf("library list email=%q pieces=%d books=%d", pathEmail, len(library.Pieces), len(library.Books))
	writeJSON(w, http.StatusOK, library)
}

func (s *server) handleCreatePiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	var req pieceRequest
	if !decodeJSONBody(w, r, &req) {
		return
	}
	piece, ok := parsePieceRequest(w, req, true)
	if !ok {
		return
	}

	created, err := s.collections.CreatePiece(r.Context(), pathEmail, piece)
	if err != nil {
		log.Printf("piece create failed email=%q name=%q err=%v", pathEmail, piece.Name, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create piece"})
		return
	}

	log.Printf("piece create email=%q id=%q name=%q pdf=%q", pathEmail, created.ID, created.Name, created.PDF)
	writeJSON(w, http.StatusCreated, created)
}

func (s *server) handleUpdatePiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	pieceKey := bookParam(r, "piece")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(pieceKey, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	var req pieceRequest
	if !decodeJSONBody(w, r, &req) {
		return
	}
	piece, ok := parsePieceRequest(w, req, false)
	if !ok {
		return
	}

	updated, err := s.collections.UpdatePiece(r.Context(), pathEmail, pieceKey, piece)
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "piece not found"})
			return
		}
		log.Printf("piece update failed email=%q piece=%q err=%v", pathEmail, pieceKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save piece"})
		return
	}

	log.Printf("piece update email=%q id=%q name=%q", pathEmail, updated.ID, updated.Name)
	writeJSON(w, http.StatusOK, updated)
}

func (s *server) handleDeletePiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	pieceKey := bookParam(r, "piece")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(pieceKey, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.DeletePiece(r.Context(), pathEmail, pieceKey); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "piece not found"})
			return
		}
		log.Printf("piece delete failed email=%q piece=%q err=%v", pathEmail, pieceKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete piece"})
		return
	}

	log.Printf("piece delete email=%q piece=%q", pathEmail, pieceKey)
	w.WriteHeader(http.StatusNoContent)
}

func (s *server) handleCreateBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	var req bookRequest
	if !decodeJSONBody(w, r, &req) {
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

	created, err := s.collections.CreateBook(r.Context(), pathEmail, name)
	if err != nil {
		log.Printf("book create failed email=%q name=%q err=%v", pathEmail, name, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create book"})
		return
	}

	log.Printf("book create email=%q id=%q name=%q", pathEmail, created.ID, created.Name)
	writeJSON(w, http.StatusCreated, created)
}

func (s *server) handleUpdateBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	bookKey := bookParam(r, "book")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(bookKey, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	var req bookRequest
	if !decodeJSONBody(w, r, &req) {
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

	updated, err := s.collections.UpdateBook(r.Context(), pathEmail, bookKey, name)
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "book not found"})
			return
		}
		log.Printf("book update failed email=%q book=%q err=%v", pathEmail, bookKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save book"})
		return
	}

	log.Printf("book update email=%q id=%q name=%q", pathEmail, updated.ID, updated.Name)
	writeJSON(w, http.StatusOK, updated)
}

func (s *server) handleDeleteLibraryBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	bookKey := bookParam(r, "book")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(bookKey, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.DeleteBook(r.Context(), pathEmail, bookKey); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "book not found"})
			return
		}
		log.Printf("book delete failed email=%q book=%q err=%v", pathEmail, bookKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete book"})
		return
	}

	log.Printf("book delete email=%q book=%q", pathEmail, bookKey)
	w.WriteHeader(http.StatusNoContent)
}

func (s *server) handleAddBookPiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	bookKey := bookParam(r, "book")
	pieceKey := bookParam(r, "piece")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(bookKey, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(pieceKey, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.AddPieceToBook(r.Context(), pathEmail, bookKey, pieceKey); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "book or piece not found"})
			return
		}
		log.Printf("book add piece failed email=%q book=%q piece=%q err=%v", pathEmail, bookKey, pieceKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not add piece to book"})
		return
	}

	log.Printf("book add piece email=%q book=%q piece=%q", pathEmail, bookKey, pieceKey)
	w.WriteHeader(http.StatusNoContent)
}

func (s *server) handleRemoveBookPiece(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	bookKey := bookParam(r, "book")
	pieceKey := bookParam(r, "piece")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(bookKey, "book"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(pieceKey, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.RemovePieceFromBook(r.Context(), pathEmail, bookKey, pieceKey); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "book or piece not found"})
			return
		}
		log.Printf("book remove piece failed email=%q book=%q piece=%q err=%v", pathEmail, bookKey, pieceKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not remove piece from book"})
		return
	}

	log.Printf("book remove piece email=%q book=%q piece=%q", pathEmail, bookKey, pieceKey)
	w.WriteHeader(http.StatusNoContent)
}
