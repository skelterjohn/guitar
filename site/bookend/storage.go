package main

import (
	"context"
	"errors"
	"fmt"
	"io"
	"sort"
	"strings"
	"time"

	"cloud.google.com/go/storage"
	"google.golang.org/api/iterator"
)

const maxBookPDFBytes = 50 << 20 // 50 MiB
const maxBookZipBytes = 50 << 20 // 50 MiB compressed upload
const maxBookZipEntries = 500
const maxBookZipUncompressedBytes = 200 << 20 // 200 MiB total extracted
const maxBookStorageBytes = 1 << 30           // 1 GiB per user

var errStorageQuotaExceeded = errors.New("storage quota exceeded (1 GB limit)")

type fileUsage struct {
	Total int64
	Files map[string]int64
}

type bookFile struct {
	Name       string    `json:"name"`
	ModifiedAt time.Time `json:"modifiedAt"`
}

type objectStore interface {
	List(ctx context.Context, email string) ([]bookFile, error)
	Usage(ctx context.Context, email string) (fileUsage, error)
	Read(ctx context.Context, objectKey string) (io.ReadCloser, error)
	Write(ctx context.Context, objectKey string, r io.Reader, contentType string) error
	Delete(ctx context.Context, objectKey string) error
}

func projectedStorageUsage(usage fileUsage, incoming map[string]int64) int64 {
	projected := usage.Total
	for filename, size := range incoming {
		if old, ok := usage.Files[filename]; ok {
			projected -= old
		}
		projected += size
	}
	return projected
}

func checkStorageQuota(usage fileUsage, incoming map[string]int64) error {
	if projectedStorageUsage(usage, incoming) > maxBookStorageBytes {
		return errStorageQuotaExceeded
	}
	return nil
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

func (s *gcsStore) List(ctx context.Context, email string) ([]bookFile, error) {
	prefix := bookObjectPrefix(email)
	it := s.client.Bucket(s.bucket).Objects(ctx, &storage.Query{Prefix: prefix})

	var files []bookFile
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
		files = append(files, bookFile{
			Name:       name,
			ModifiedAt: attrs.Updated,
		})
	}
	sort.Slice(files, func(i, j int) bool {
		return files[i].Name < files[j].Name
	})
	return files, nil
}

func (s *gcsStore) Usage(ctx context.Context, email string) (fileUsage, error) {
	prefix := bookObjectPrefix(email)
	it := s.client.Bucket(s.bucket).Objects(ctx, &storage.Query{Prefix: prefix})

	usage := fileUsage{Files: map[string]int64{}}
	rasterPrefix := annotationRasterPrefix(email)
	for {
		attrs, err := it.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return fileUsage{}, err
		}
		name := strings.TrimPrefix(attrs.Name, prefix)
		if name == "" {
			continue
		}
		if strings.HasPrefix(attrs.Name, rasterPrefix) {
			rasterName := strings.TrimPrefix(attrs.Name, rasterPrefix)
			if err := validateAnnotationRasterName(rasterName); err != nil {
				continue
			}
			usage.Files[rasterName] = attrs.Size
			usage.Total += attrs.Size
			continue
		}
		if strings.Contains(name, "/") {
			continue
		}
		if err := validateBookFilename(name); err != nil {
			continue
		}
		usage.Files[name] = attrs.Size
		usage.Total += attrs.Size
	}
	return usage, nil
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
