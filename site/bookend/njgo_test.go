package main

import "testing"

func TestValidateNjgoPdfFilename(t *testing.T) {
	valid := []string{
		"breakfast_around_3.pdf",
		"breakfast_around_3a.pdf",
		"fireflies_score.pdf",
		"a.pdf",
	}
	for _, name := range valid {
		if err := validateNjgoPdfFilename(name); err != nil {
			t.Fatalf("%q: expected valid, got %v", name, err)
		}
	}

	invalid := []string{
		"",
		"Breakfast_Around_3.pdf",
		"breakfast around 3.pdf",
		"breakfast_around_3.txt",
		"../breakfast_around_3.pdf",
		"dir/breakfast_around_3.pdf",
		"breakfast__around_3.pdf",
		"_breakfast_around_3.pdf",
		"breakfast_around_3_.pdf",
	}
	for _, name := range invalid {
		if err := validateNjgoPdfFilename(name); err == nil {
			t.Fatalf("%q: expected invalid", name)
		}
	}
}

func TestRepPdfObjectKey(t *testing.T) {
	got := repPdfObjectKey("secretfolder", "breakfast_around_3.pdf")
	want := "secretfolder/breakfast_around_3.pdf"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}
