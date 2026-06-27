package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sort"
	"strings"

	"cloud.google.com/go/storage"
	"google.golang.org/api/iterator"
)

const maxBookPDFBytes = 50 << 20 // 50 MiB

type objectStore interface {
	List(ctx context.Context, email string) ([]string, error)
	Read(ctx context.Context, objectKey string) (io.ReadCloser, error)
	Write(ctx context.Context, objectKey string, r io.Reader, contentType string) error
	Delete(ctx context.Context, objectKey string) error
}

type gcsStore struct {
	client *storage.Client
	bucket string
}

func newGCSStore(ctx context.Context, bucket string) (*gcsStore, error) {
	if strings.TrimSpace(bucket) == "" {
		return nil, errors.New("BOOK_BUCKET is not set")
	}
	client, err := storage.NewClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("gcs client: %w", err)
	}
	return &gcsStore{client: client, bucket: bucket}, nil
}

func (s *gcsStore) List(ctx context.Context, email string) ([]string, error) {
	prefix := bookObjectPrefix(email)
	it := s.client.Bucket(s.bucket).Objects(ctx, &storage.Query{Prefix: prefix})

	var files []string
	for {
		attrs, err := it.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, err
		}
		name := strings.TrimPrefix(attrs.Name, prefix)
		if name == "" || strings.Contains(name, "/") {
			continue
		}
		if err := validateBookFilename(name); err != nil {
			continue
		}
		files = append(files, name)
	}
	sort.Strings(files)
	return files, nil
}

func (s *gcsStore) Read(ctx context.Context, objectKey string) (io.ReadCloser, error) {
	obj := s.client.Bucket(s.bucket).Object(objectKey)
	reader, err := obj.NewReader(ctx)
	if err != nil {
		if errors.Is(err, storage.ErrObjectNotExist) {
			return nil, errNotFound
		}
		return nil, err
	}
	return reader, nil
}

func (s *gcsStore) Write(ctx context.Context, objectKey string, r io.Reader, contentType string) error {
	obj := s.client.Bucket(s.bucket).Object(objectKey)
	writer := obj.NewWriter(ctx)
	writer.ContentType = contentType
	if _, err := io.Copy(writer, r); err != nil {
		_ = writer.Close()
		return err
	}
	return writer.Close()
}

func (s *gcsStore) Delete(ctx context.Context, objectKey string) error {
	obj := s.client.Bucket(s.bucket).Object(objectKey)
	if err := obj.Delete(ctx); err != nil {
		if errors.Is(err, storage.ErrObjectNotExist) {
			return errNotFound
		}
		return err
	}
	return nil
}

func bookObjectPrefix(email string) string {
	return fmt.Sprintf("%s/", strings.ToLower(strings.TrimSpace(email)))
}

func bookObjectKey(email, filename string) string {
	return bookObjectPrefix(email) + filename
}
