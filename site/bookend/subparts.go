package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	fieldPageStart = "pageStart"
	fieldPageEnd   = "pageEnd"
	maxPDFPage     = 9999
)

type userSubpart struct {
	ID        string `json:"id"`
	Part      string `json:"part"`
	PageStart int    `json:"pageStart"`
	PageEnd   int    `json:"pageEnd"`
}

type subpartRequest struct {
	Part      string `json:"part"`
	PageStart int    `json:"pageStart"`
	PageEnd   int    `json:"pageEnd"`
}

func subpartFromSnapshot(snap *firestore.DocumentSnapshot) userSubpart {
	data := snap.Data()
	return userSubpart{
		ID:        snap.Ref.ID,
		Part:      stringField(data, fieldPart, ""),
		PageStart: intField(data, fieldPageStart),
		PageEnd:   intField(data, fieldPageEnd),
	}
}

func intField(data map[string]any, key string) int {
	switch value := data[key].(type) {
	case int64:
		return int(value)
	case int:
		return value
	case float64:
		return int(value)
	default:
		return 0
	}
}

func validatePageRange(pageStart, pageEnd int) error {
	if pageStart < 1 || pageStart > maxPDFPage {
		return errors.New("page start must be between 1 and 9999")
	}
	if pageEnd < 1 || pageEnd > maxPDFPage {
		return errors.New("page end must be between 1 and 9999")
	}
	if pageEnd < pageStart {
		return errors.New("page end must be greater than or equal to page start")
	}
	return nil
}

func parseSubpartRequest(w http.ResponseWriter, req subpartRequest) (userSubpart, bool) {
	part := strings.TrimSpace(req.Part)
	if part == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing part"})
		return userSubpart{}, false
	}
	if err := validateOptionalText(part, "part", 500); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return userSubpart{}, false
	}

	pageStart := req.PageStart
	pageEnd := req.PageEnd
	if pageEnd == 0 {
		pageEnd = pageStart
	}
	if pageStart == 0 {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing page"})
		return userSubpart{}, false
	}
	if err := validatePageRange(pageStart, pageEnd); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return userSubpart{}, false
	}

	return userSubpart{
		Part:      part,
		PageStart: pageStart,
		PageEnd:   pageEnd,
	}, true
}

func sortSubparts(subparts []userSubpart) {
	sort.Slice(subparts, func(i, j int) bool {
		if subparts[i].PageStart != subparts[j].PageStart {
			return subparts[i].PageStart < subparts[j].PageStart
		}
		if subparts[i].PageEnd != subparts[j].PageEnd {
			return subparts[i].PageEnd < subparts[j].PageEnd
		}
		return subparts[i].Part < subparts[j].Part
	})
}

func (s *firestoreCollectionStore) listSubparts(ctx context.Context, pieceRef *firestore.DocumentRef) ([]userSubpart, error) {
	iter := pieceRef.Collection("subparts").Documents(ctx)
	defer iter.Stop()

	var subparts []userSubpart
	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}
		subparts = append(subparts, subpartFromSnapshot(doc))
	}
	sortSubparts(subparts)
	if subparts == nil {
		subparts = []userSubpart{}
	}
	return subparts, nil
}

func (s *firestoreCollectionStore) deleteSubparts(ctx context.Context, pieceRef *firestore.DocumentRef) error {
	iter := pieceRef.Collection("subparts").Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			return nil
		}
		if err != nil {
			return err
		}
		if _, err := doc.Ref.Delete(ctx); err != nil {
			return err
		}
	}
}

func (s *firestoreCollectionStore) CreateSubpart(ctx context.Context, email, pieceKey string, subpart userSubpart) (userSubpart, error) {
	pieceRef, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return userSubpart{}, err
	}

	ref := pieceRef.Collection("subparts").Doc(collectionDocID(
		subpart.Part + "-" + strconv.Itoa(subpart.PageStart) + "-" + strconv.Itoa(subpart.PageEnd),
	))
	_, err = ref.Set(ctx, map[string]any{
		fieldPart:      subpart.Part,
		fieldPageStart: subpart.PageStart,
		fieldPageEnd:   subpart.PageEnd,
	})
	if err != nil {
		return userSubpart{}, err
	}
	snap, err := ref.Get(ctx)
	if err != nil {
		return userSubpart{}, err
	}
	return subpartFromSnapshot(snap), nil
}

func (s *firestoreCollectionStore) DeleteSubpart(ctx context.Context, email, pieceKey, subpartKey string) error {
	pieceRef, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return err
	}
	ref := pieceRef.Collection("subparts").Doc(subpartKey)
	if _, err := ref.Get(ctx); err != nil {
		if status.Code(err) == codes.NotFound {
			return errNotFound
		}
		return err
	}
	_, err = ref.Delete(ctx)
	return err
}

func (s *server) handleCreateSubpart(w http.ResponseWriter, r *http.Request) {
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

	var req subpartRequest
	if !decodeJSONBody(w, r, &req) {
		return
	}
	subpart, ok := parseSubpartRequest(w, req)
	if !ok {
		return
	}

	created, err := s.collections.CreateSubpart(r.Context(), pathEmail, pieceKey, subpart)
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "piece not found"})
			return
		}
		log.Printf("subpart create failed email=%q piece=%q err=%v", pathEmail, pieceKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not create subpart"})
		return
	}

	log.Printf("subpart create email=%q piece=%q id=%q part=%q pages=%d-%d",
		pathEmail, pieceKey, created.ID, created.Part, created.PageStart, created.PageEnd)
	writeJSON(w, http.StatusCreated, created)
}

func (s *server) handleDeleteSubpart(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	pieceKey := bookParam(r, "piece")
	subpartKey := bookParam(r, "subpart")
	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateCollectionSegment(pieceKey, "piece"); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if strings.TrimSpace(subpartKey) == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing subpart"})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.collections.DeleteSubpart(r.Context(), pathEmail, pieceKey, subpartKey); err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "subpart not found"})
			return
		}
		log.Printf("subpart delete failed email=%q piece=%q subpart=%q err=%v", pathEmail, pieceKey, subpartKey, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete subpart"})
		return
	}

	log.Printf("subpart delete email=%q piece=%q subpart=%q", pathEmail, pieceKey, subpartKey)
	w.WriteHeader(http.StatusNoContent)
}
