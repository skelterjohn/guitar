package main

import "testing"

func TestValidatePageRange(t *testing.T) {
	if err := validatePageRange(1, 1); err != nil {
		t.Fatalf("single page: %v", err)
	}
	if err := validatePageRange(2, 5); err != nil {
		t.Fatalf("page range: %v", err)
	}
	if err := validatePageRange(5, 2); err == nil {
		t.Fatal("expected end before start to fail")
	}
	if err := validatePageRange(0, 1); err == nil {
		t.Fatal("expected zero start to fail")
	}
}
