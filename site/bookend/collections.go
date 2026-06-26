package main

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"sort"
	"strings"
	"unicode"

	firebase "firebase.google.com/go/v4"
	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const partPDFField = "pdf"

type collectionStore interface {
	ListUserCollection(ctx context.Context, email string) (userCollection, error)
	GetPartPDF(ctx context.Context, email, book, piece, part string) (string, error)
	SetPartPDF(ctx context.Context, email, book, piece, part, pdf string) error
}

type collectionPart struct {
	Name string `json:"name"`
	PDF  string `json:"pdf"`
}

type collectionPiece struct {
	Name  string           `json:"name"`
	Parts []collectionPart `json:"parts"`
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

func (s *firestoreCollectionStore) partRef(email, book, piece, part string) *firestore.DocumentRef {
	email = collectionEmail(email)
	return s.client.Collection("users").Doc(email).
		Collection("books").Doc(book).
		Collection("piece").Doc(piece).
		Collection("parts").Doc(part)
}

func (s *firestoreCollectionStore) GetPartPDF(ctx context.Context, email, book, piece, part string) (string, error) {
	snap, err := s.partRef(email, book, piece, part).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return "", errNotFound
		}
		return "", err
	}
	return pdfFromSnapshot(snap)
}

func (s *firestoreCollectionStore) SetPartPDF(ctx context.Context, email, book, piece, part, pdf string) error {
	_, err := s.partRef(email, book, piece, part).Set(ctx, map[string]any{
		partPDFField: pdf,
	})
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
			Name:   bookDoc.Ref.ID,
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
			Name:  pieceDoc.Ref.ID,
			Parts: parts,
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
			Name: partDoc.Ref.ID,
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

func collectionEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

func validateCollectionSegment(name, label string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return errors.New("missing " + label)
	}
	if name != filepath.Base(name) {
		return errors.New("invalid " + label)
	}
	if strings.Contains(name, "..") {
		return errors.New("invalid " + label)
	}
	for _, r := range name {
		if unicode.IsLetter(r) || unicode.IsDigit(r) || r == '-' || r == '_' || r == '.' || r == ' ' {
			continue
		}
		return errors.New("invalid " + label)
	}
	return nil
}

type partPDFRequest struct {
	PDF string `json:"pdf"`
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
