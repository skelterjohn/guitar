package main

import (
	"archive/zip"
	"bytes"
	"context"
	"io"
	"strings"
	"testing"
)

type fakeObjectStore struct {
	objects map[string][]byte
}

func (f *fakeObjectStore) List(ctx context.Context, email string) ([]string, error) {
	prefix := bookObjectPrefix(email)
	var files []string
	for key := range f.objects {
		if !strings.HasPrefix(key, prefix) {
			continue
		}
		name := strings.TrimPrefix(key, prefix)
		if name == "" || strings.Contains(name, "/") {
			continue
		}
		files = append(files, name)
	}
	return files, nil
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
