package main

import (
	"archive/zip"
	"bytes"
	"context"
	"errors"
	"io"
	"sort"
	"strings"
	"testing"
	"time"
)

type fakeObjectStore struct {
	objects map[string][]byte
}

func (f *fakeObjectStore) List(ctx context.Context, email string) ([]bookFile, error) {
	prefix := bookObjectPrefix(email)
	var files []bookFile
	for key := range f.objects {
		if !strings.HasPrefix(key, prefix) {
			continue
		}
		name := strings.TrimPrefix(key, prefix)
		if name == "" || strings.Contains(name, "/") {
			continue
		}
		files = append(files, bookFile{
			Name:       name,
			ModifiedAt: time.Unix(0, 0).UTC(),
		})
	}
	sort.Slice(files, func(i, j int) bool {
		return files[i].Name < files[j].Name
	})
	return files, nil
}

func (f *fakeObjectStore) Usage(ctx context.Context, email string) (fileUsage, error) {
	prefix := bookObjectPrefix(email)
	usage := fileUsage{Files: map[string]int64{}}
	for key, data := range f.objects {
		if !strings.HasPrefix(key, prefix) {
			continue
		}
		name := strings.TrimPrefix(key, prefix)
		if name == "" || strings.Contains(name, "/") {
			continue
		}
		size := int64(len(data))
		usage.Files[name] = size
		usage.Total += size
	}
	return usage, nil
}

func (f *fakeObjectStore) Read(ctx context.Context, objectKey string) (io.ReadCloser, error) {
	data, ok := f.objects[objectKey]
	if !ok {
		return nil, errNotFound
	}
	return io.NopCloser(bytes.NewReader(data)), nil
}

func (f *fakeObjectStore) Write(ctx context.Context, objectKey string, r io.Reader, contentType string) error {
	data, err := io.ReadAll(r)
	if err != nil {
		return err
	}
	f.objects[objectKey] = data
	return nil
}

func (f *fakeObjectStore) Delete(ctx context.Context, objectKey string) error {
	if _, ok := f.objects[objectKey]; !ok {
		return errNotFound
	}
	delete(f.objects, objectKey)
	return nil
}

func TestBookZipFilename(t *testing.T) {
	got := bookZipFilename("User@Example.com")
	want := "bluebridge-user@example.com-export.zip"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}

func TestWriteBookZip(t *testing.T) {
	email := "user@example.com"
	store := &fakeObjectStore{
		objects: map[string][]byte{
			bookObjectKey(email, "first.pdf"):  []byte("%PDF-first"),
			bookObjectKey(email, "second.pdf"): []byte("%PDF-second"),
		},
	}

	var buf bytes.Buffer
	count, err := writeBookZip(&buf, context.Background(), store, email)
	if err != nil {
		t.Fatalf("writeBookZip: %v", err)
	}
	if count != 2 {
		t.Fatalf("count = %d, want 2", count)
	}

	reader, err := zip.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		t.Fatalf("zip.NewReader: %v", err)
	}
	if len(reader.File) != 2 {
		t.Fatalf("zip entries = %d, want 2", len(reader.File))
	}

	got := map[string]string{}
	for _, file := range reader.File {
		rc, err := file.Open()
		if err != nil {
			t.Fatalf("open %q: %v", file.Name, err)
		}
		data, err := io.ReadAll(rc)
		_ = rc.Close()
		if err != nil {
			t.Fatalf("read %q: %v", file.Name, err)
		}
		got[file.Name] = string(data)
	}

	if got["first.pdf"] != "%PDF-first" {
		t.Fatalf("first.pdf = %q", got["first.pdf"])
	}
	if got["second.pdf"] != "%PDF-second" {
		t.Fatalf("second.pdf = %q", got["second.pdf"])
	}
}

func TestWriteBookZipEmpty(t *testing.T) {
	store := &fakeObjectStore{objects: map[string][]byte{}}
	var buf bytes.Buffer
	count, err := writeBookZip(&buf, context.Background(), store, "user@example.com")
	if err != nil {
		t.Fatalf("writeBookZip: %v", err)
	}
	if count != 0 {
		t.Fatalf("count = %d, want 0", count)
	}

	reader, err := zip.NewReader(bytes.NewReader(buf.Bytes()), int64(buf.Len()))
	if err != nil {
		t.Fatalf("zip.NewReader: %v", err)
	}
	if len(reader.File) != 0 {
		t.Fatalf("zip entries = %d, want 0", len(reader.File))
	}
}

func buildTestZip(entries map[string][]byte) []byte {
	var buf bytes.Buffer
	zw := zip.NewWriter(&buf)
	for name, data := range entries {
		w, err := zw.Create(name)
		if err != nil {
			panic(err)
		}
		if _, err := w.Write(data); err != nil {
			panic(err)
		}
	}
	if err := zw.Close(); err != nil {
		panic(err)
	}
	return buf.Bytes()
}

func TestIngestBookZip(t *testing.T) {
	email := "user@example.com"
	store := &fakeObjectStore{objects: map[string][]byte{}}
	zipData := buildTestZip(map[string][]byte{
		"nested/first.pdf":        []byte("%PDF-first"),
		"../../unsafe/second.pdf": []byte("%PDF-second"),
		"readme.txt":              []byte("not a pdf"),
	})

	files, err := ingestBookZip(context.Background(), store, email, zipData)
	if err != nil {
		t.Fatalf("ingestBookZip: %v", err)
	}
	if len(files) != 2 {
		t.Fatalf("files = %v, want 2 pdfs", files)
	}

	first := store.objects[bookObjectKey(email, "first.pdf")]
	if string(first) != "%PDF-first" {
		t.Fatalf("first.pdf = %q", first)
	}
	second := store.objects[bookObjectKey(email, "second.pdf")]
	if string(second) != "%PDF-second" {
		t.Fatalf("second.pdf = %q", second)
	}
}

func TestIngestBookZipNoPdfs(t *testing.T) {
	store := &fakeObjectStore{objects: map[string][]byte{}}
	zipData := buildTestZip(map[string][]byte{
		"readme.txt": []byte("hello"),
	})

	_, err := ingestBookZip(context.Background(), store, "user@example.com", zipData)
	if !errors.Is(err, errZipNoPdfs) {
		t.Fatalf("expected errZipNoPdfs, got %v", err)
	}
}

func TestCheckStorageQuota(t *testing.T) {
	usage := fileUsage{
		Total: (1 << 30) - 100,
		Files: map[string]int64{
			"existing.pdf": (1 << 30) - 100,
		},
	}

	if err := checkStorageQuota(usage, map[string]int64{"new.pdf": 101}); err == nil {
		t.Fatal("expected quota error when upload exceeds 1 GB")
	}

	if err := checkStorageQuota(usage, map[string]int64{"existing.pdf": 50}); err != nil {
		t.Fatalf("overwrite should free space before counting new size: %v", err)
	}

	if err := checkStorageQuota(usage, map[string]int64{"new.pdf": 100}); err != nil {
		t.Fatalf("expected room for 100 bytes: %v", err)
	}
}
