package main

import (
	"testing"
)

func TestValidateAnnotationHash(t *testing.T) {
	valid := []string{"abc123", "md5-deadbeef", "checksum_v1", emptyAnnotationRastersHash}
	for _, hash := range valid {
		if err := validateAnnotationHash(hash); err != nil {
			t.Fatalf("%q: expected valid, got %v", hash, err)
		}
	}

	invalid := []string{"", "has spaces", "bad/slash", stringsRepeat("a", 129)}
	for _, hash := range invalid {
		if err := validateAnnotationHash(hash); err == nil {
			t.Fatalf("%q: expected invalid", hash)
		}
	}
}

func stringsRepeat(s string, n int) string {
	out := make([]byte, n)
	for i := range out {
		out[i] = s[0]
	}
	return string(out)
}

func TestAnnotationRasterFilename(t *testing.T) {
	pdf := "score.pdf"
	got := annotationRasterFilename(pdf, 3, "red")
	want := "score.pdf-p3-red.webp"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}

	page, layer, ok := parseAnnotationRasterFilename(pdf, got)
	if !ok {
		t.Fatal("expected parse ok")
	}
	if page != 3 || layer != "red" {
		t.Fatalf("got page=%d layer=%q", page, layer)
	}
}

func TestParseAnnotationRasterFilenameRejectsMismatch(t *testing.T) {
	_, _, ok := parseAnnotationRasterFilename("score.pdf", "other.pdf-p1-red.webp")
	if ok {
		t.Fatal("expected mismatch")
	}
	_, _, ok = parseAnnotationRasterFilename("score.pdf", "score.pdf-p1-purple.webp")
	if ok {
		t.Fatal("expected invalid layer")
	}
}

func TestAnnotationRasterObjectKey(t *testing.T) {
	got := annotationRasterObjectKey("User@Example.com", "score.pdf-p1-black.webp")
	want := "user@example.com/rasters/score.pdf-p1-black.webp"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}

func TestParseAnnotationPagesJSON(t *testing.T) {
	pages, err := parseAnnotationPagesJSON(`{"1":{"width":1536,"height":2048},"2":{"width":1536,"height":1200}}`, false)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if pages["1"].Width != 1536 || pages["2"].Height != 1200 {
		t.Fatalf("unexpected pages: %#v", pages)
	}

	if _, err := parseAnnotationPagesJSON(`{"1":{"width":0,"height":10}}`, false); err == nil {
		t.Fatal("expected invalid dimensions")
	}

	emptyPages, err := parseAnnotationPagesJSON(`{}`, true)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(emptyPages) != 0 {
		t.Fatalf("expected empty pages, got %#v", emptyPages)
	}
}
