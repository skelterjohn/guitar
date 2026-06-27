package main

import (
	"context"
	"errors"
	"time"

	firebase "firebase.google.com/go/v4"
	"cloud.google.com/go/firestore"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

const (
	fieldAnnotationHash      = "hash"
	fieldAnnotationColor     = "color"
	fieldAnnotationRasters   = "rasters"
	fieldAnnotationPages     = "pages"
	fieldAnnotationUpdatedAt = "updatedAt"
	fieldAnnotationPDF       = "pdf"
)

type annotationPageDims struct {
	Width  int `json:"width"`
	Height int `json:"height"`
}

type annotationRasterFile struct {
	Name   string `json:"name"`
	Page   int    `json:"page"`
	Layer  string `json:"layer"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
}

type annotationRasterRecord struct {
	PDF     string                        `json:"pdf"`
	Hash    string                        `json:"hash"`
	Color   string                        `json:"color,omitempty"`
	Pages   map[string]annotationPageDims `json:"pages,omitempty"`
	Rasters []annotationRasterFile        `json:"rasters"`
}

type annotationStore interface {
	GetAnnotationRasters(ctx context.Context, email, pdf string) (annotationRasterRecord, error)
	PutAnnotationRasters(ctx context.Context, email, pdf string, record annotationRasterRecord) error
}

type firestoreAnnotationStore struct {
	client *firestore.Client
}

func newFirestoreAnnotationStore(ctx context.Context, fbApp *firebase.App) (*firestoreAnnotationStore, error) {
	client, err := fbApp.Firestore(ctx)
	if err != nil {
		return nil, err
	}
	return &firestoreAnnotationStore{client: client}, nil
}

func (s *firestoreAnnotationStore) annotationRef(email, pdf string) *firestore.DocumentRef {
	return s.client.Collection("users").Doc(collectionEmail(email)).Collection("annotationRasters").Doc(collectionDocID(pdf))
}

func (s *firestoreAnnotationStore) GetAnnotationRasters(ctx context.Context, email, pdf string) (annotationRasterRecord, error) {
	snap, err := s.annotationRef(email, pdf).Get(ctx)
	if err != nil {
		if status.Code(err) == codes.NotFound {
			return annotationRasterRecord{}, errNotFound
		}
		return annotationRasterRecord{}, err
	}
	return annotationRecordFromSnapshot(snap, pdf)
}

func (s *firestoreAnnotationStore) PutAnnotationRasters(ctx context.Context, email, pdf string, record annotationRasterRecord) error {
	data := map[string]any{
		fieldAnnotationPDF:       pdf,
		fieldAnnotationHash:      record.Hash,
		fieldAnnotationRasters:   record.Rasters,
		fieldAnnotationUpdatedAt: time.Now().UTC(),
	}
	if record.Color != "" {
		data[fieldAnnotationColor] = record.Color
	}
	if len(record.Pages) > 0 {
		data[fieldAnnotationPages] = record.Pages
	}
	_, err := s.annotationRef(email, pdf).Set(ctx, data)
	return err
}

func annotationRecordFromSnapshot(snap *firestore.DocumentSnapshot, pdf string) (annotationRasterRecord, error) {
	data := snap.Data()
	record := annotationRasterRecord{
		PDF:  stringField(data, fieldAnnotationPDF, pdf),
		Hash: stringField(data, fieldAnnotationHash, ""),
		Color: stringField(data, fieldAnnotationColor, ""),
	}
	if record.Hash == "" {
		return annotationRasterRecord{}, errors.New("annotation record missing hash")
	}

	if pagesRaw, ok := data[fieldAnnotationPages].(map[string]any); ok {
		record.Pages = parseAnnotationPagesMap(pagesRaw)
	}

	switch raw := data[fieldAnnotationRasters].(type) {
	case []any:
		for _, item := range raw {
			entry, ok := item.(map[string]any)
			if !ok {
				continue
			}
			file := annotationRasterFile{
				Name:  stringField(entry, "name", ""),
				Layer: stringField(entry, "layer", ""),
			}
			file.Page = intField(entry, "page")
			file.Width = intField(entry, "width")
			file.Height = intField(entry, "height")
			if file.Name != "" {
				record.Rasters = append(record.Rasters, file)
			}
		}
	}

	return record, nil
}

func parseAnnotationPagesMap(raw map[string]any) map[string]annotationPageDims {
	out := make(map[string]annotationPageDims, len(raw))
	for key, value := range raw {
		entry, ok := value.(map[string]any)
		if !ok {
			continue
		}
		width := intField(entry, "width")
		height := intField(entry, "height")
		if width <= 0 || height <= 0 {
			continue
		}
		out[key] = annotationPageDims{Width: width, Height: height}
	}
	return out
}
