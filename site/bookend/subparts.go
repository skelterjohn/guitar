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
	fieldPageStart              = "pageStart"
	fieldPageEnd                = "pageEnd"
	fieldNestedSubpartsMigrated = "nestedSubpartsMigrated"
	maxPDFPage                  = 9999
)

type userSubpart struct {
	ID        string `json:"id"`
	PieceID   string `json:"pieceId,omitempty"`
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
		PieceID:   stringField(data, fieldPieceID, ""),
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

func subpartDocID(pieceID string, subpart userSubpart) string {
	return collectionDocID(
		pieceID + "-" + subpart.Part + "-" + strconv.Itoa(subpart.PageStart) + "-" + strconv.Itoa(subpart.PageEnd),
	)
}

func (s *firestoreCollectionStore) listAllSubparts(ctx context.Context, email string) (map[string][]userSubpart, error) {
	if err := s.migrateNestedSubparts(ctx, email); err != nil {
		return nil, err
	}

	iter := s.subpartsCollection(email).Documents(ctx)
	defer iter.Stop()

	byPiece := map[string][]userSubpart{}
	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}
		pieceID := stringField(doc.Data(), fieldPieceID, "")
		if pieceID == "" {
			continue
		}
		byPiece[pieceID] = append(byPiece[pieceID], subpartFromSnapshot(doc))
	}
	for pieceID, subparts := range byPiece {
		sortSubparts(subparts)
		byPiece[pieceID] = subparts
	}
	return byPiece, nil
}

func (s *firestoreCollectionStore) resolveSubpartRef(ctx context.Context, email, subpart string) (*firestore.DocumentRef, error) {
	subpart = strings.TrimSpace(subpart)
	if subpart == "" {
		return nil, errors.New("missing subpart")
	}

	ref := s.subpartsCollection(email).Doc(subpart)
	if _, err := ref.Get(ctx); err == nil {
		return ref, nil
	} else if status.Code(err) != codes.NotFound {
		return nil, err
	}
	return nil, errNotFound
}

func (s *firestoreCollectionStore) removeSubpartFromAllBooks(ctx context.Context, email, subpartID string) error {
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
		ids := subpartIDsFromSnapshot(doc)
		if !containsString(ids, subpartID) {
			continue
		}
		next := removeString(ids, subpartID)
		if _, err := doc.Ref.Update(ctx, []firestore.Update{{Path: fieldSubpartIDs, Value: next}}); err != nil {
			return err
		}
	}
}

func (s *firestoreCollectionStore) deleteSubpartsForPiece(ctx context.Context, email, pieceID string) error {
	iter := s.subpartsCollection(email).Where(fieldPieceID, "==", pieceID).Documents(ctx)
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			return nil
		}
		if err != nil {
			return err
		}
		if err := s.removeSubpartFromAllBooks(ctx, email, doc.Ref.ID); err != nil {
			return err
		}
		if _, err := doc.Ref.Delete(ctx); err != nil {
			return err
		}
	}
}

func (s *firestoreCollectionStore) migrateNestedSubparts(ctx context.Context, email string) error {
	userRef := s.userRef(email)
	if snap, err := userRef.Get(ctx); err == nil {
		if migrated, _ := snap.Data()[fieldNestedSubpartsMigrated].(bool); migrated {
			return nil
		}
	} else if status.Code(err) != codes.NotFound {
		return err
	}

	iter := s.piecesCollection(email).Documents(ctx)
	defer iter.Stop()

	migratedAny := false
	for {
		doc, err := iter.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return err
		}

		nested := doc.Ref.Collection("subparts").Documents(ctx)
		for {
			subDoc, err := nested.Next()
			if errors.Is(err, iterator.Done) {
				break
			}
			if err != nil {
				nested.Stop()
				return err
			}

			migratedAny = true
			data := subDoc.Data()
			subpart := userSubpart{
				ID:        subDoc.Ref.ID,
				Part:      stringField(data, fieldPart, ""),
				PageStart: intField(data, fieldPageStart),
				PageEnd:   intField(data, fieldPageEnd),
			}
			ref := s.subpartsCollection(email).Doc(subDoc.Ref.ID)
			if _, err := ref.Set(ctx, map[string]any{
				fieldPieceID:   doc.Ref.ID,
				fieldPart:      subpart.Part,
				fieldPageStart: subpart.PageStart,
				fieldPageEnd:   subpart.PageEnd,
			}); err != nil {
				nested.Stop()
				return err
			}
			if _, err := subDoc.Ref.Delete(ctx); err != nil {
				nested.Stop()
				return err
			}
			log.Printf("subpart migrated email=%q piece=%q subpart=%q", email, doc.Ref.ID, subpart.ID)
		}
		nested.Stop()
	}

	if migratedAny {
		log.Printf("subpart migration complete email=%q", email)
	}
	_, err := userRef.Set(ctx, map[string]any{fieldNestedSubpartsMigrated: true}, firestore.MergeAll)
	return err
}

func (s *firestoreCollectionStore) CreateSubpart(ctx context.Context, email, pieceKey string, subpart userSubpart) (userSubpart, error) {
	pieceRef, err := s.resolvePieceRef(ctx, email, pieceKey)
	if err != nil {
		return userSubpart{}, err
	}

	ref := s.subpartsCollection(email).Doc(subpartDocID(pieceRef.ID, subpart))
	_, err = ref.Set(ctx, map[string]any{
		fieldPieceID:   pieceRef.ID,
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
	ref := s.subpartsCollection(email).Doc(subpartKey)
	snap, err := ref.Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return errNotFound
		}
		return err
	}
	if stringField(snap.Data(), fieldPieceID, "") != pieceRef.ID {
		return errNotFound
	}
	if err := s.removeSubpartFromAllBooks(ctx, email, ref.ID); err != nil {
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
