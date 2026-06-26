package main

import (
	"testing"
)

func TestValidateCollectionSegment(t *testing.T) {
	valid := []string{"Suzuki Book 1", "Minuet in G", "guitar_part-1"}
	for _, name := range valid {
		if err := validateCollectionSegment(name, "book"); err != nil {
			t.Fatalf("%q: expected valid, got %v", name, err)
		}
	}

	invalid := []string{"", "book/name", "../book", "book/name"}
	for _, name := range invalid {
		if err := validateCollectionSegment(name, "book"); err == nil {
			t.Fatalf("%q: expected invalid", name)
		}
	}
}

func TestCollectionEmail(t *testing.T) {
	got := collectionEmail("User@Example.com")
	want := "user@example.com"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}
