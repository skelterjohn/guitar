package main

import (
	"testing"
)

func TestValidateBookFilename(t *testing.T) {
	valid := []string{"score.pdf", "my-piece_v2.pdf", "Recital 2026.pdf"}
	for _, name := range valid {
		if err := validateBookFilename(name); err != nil {
			t.Fatalf("%q: expected valid, got %v", name, err)
		}
	}

	invalid := []string{"", "score", "score.txt", "../score.pdf", "dir/score.pdf", ".pdf"}
	for _, name := range invalid {
		if err := validateBookFilename(name); err == nil {
			t.Fatalf("%q: expected invalid", name)
		}
	}
}

func TestValidateBookEmail(t *testing.T) {
	if err := validateBookEmail("student@example.com"); err != nil {
		t.Fatalf("expected valid email, got %v", err)
	}
	if err := validateBookEmail("bad"); err == nil {
		t.Fatal("expected invalid email")
	}
}

func TestEmailsEqual(t *testing.T) {
	if !emailsEqual("User@Example.com", "user@example.com") {
		t.Fatal("expected case-insensitive match")
	}
	if emailsEqual("a@example.com", "b@example.com") {
		t.Fatal("expected mismatch")
	}
}

func TestBookObjectKey(t *testing.T) {
	got := bookObjectKey("User@Example.com", "score.pdf")
	want := "user@example.com/score.pdf"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}
