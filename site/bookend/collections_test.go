package main

import (
	"testing"
)

func TestValidateCollectionSegment(t *testing.T) {
	valid := []string{
		"Suzuki Book 1",
		"Minuet in G",
		"guitar_part-1",
		"Dorian's Garden",
		"I am Full of Music",
		"Étude (No. 2)",
		"Prélude & Fugue, BWV 846",
	}
	for _, name := range valid {
		if err := validateCollectionSegment(name, "book"); err != nil {
			t.Fatalf("%q: expected valid, got %v", name, err)
		}
	}

	invalid := []string{"", "book/name", "../book", "back\\slash", ".", "..", "__id__"}
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

func TestCollectionDocID(t *testing.T) {
	got := collectionDocID("Dorian's Garden")
	if got == "Dorian's Garden" {
		t.Fatal("expected sanitized ID, got display name")
	}
	if got != collectionDocID("Dorian's Garden") {
		t.Fatal("expected stable ID")
	}
	if got == collectionDocID("Dorians Garden") {
		t.Fatal("expected hash suffix to distinguish similar names")
	}
}
