package main

import "testing"

func TestValidateNjgoPdfFilename(t *testing.T) {
	valid := []string{
		"asmuth_breakfast_g3_20260819.pdf",
		"sabet_fireflies_score_20260819a.pdf",
		"a_20260101.pdf",
	}
	for _, name := range valid {
		if err := validateNjgoPdfFilename(name); err != nil {
			t.Fatalf("%q: expected valid, got %v", name, err)
		}
	}

	invalid := []string{
		"",
		"score.pdf",
		"asmuth_breakfast_g3.pdf",
		"asmuth_breakfast_g3_2.pdf",
		"asmuth_breakfast_g3_2026081.pdf",
		"asmuth_breakfast_g3_202608199.pdf",
		"asmuth_breakfast_g3_20260819ab.pdf",
		"Asmuth_Breakfast_G3_20260819.pdf",
		"asmuth breakfast g3 20260819.pdf",
		"asmuth_breakfast_g3_20260819.txt",
		"../asmuth_breakfast_g3_20260819.pdf",
		"dir/asmuth_breakfast_g3_20260819.pdf",
		"asmuth__breakfast_g3_20260819.pdf",
	}
	for _, name := range invalid {
		if err := validateNjgoPdfFilename(name); err == nil {
			t.Fatalf("%q: expected invalid", name)
		}
	}
}

func TestRepPdfObjectKey(t *testing.T) {
	got := repPdfObjectKey("secretfolder", "asmuth_breakfast_g3_20260819.pdf")
	want := "secretfolder/asmuth_breakfast_g3_20260819.pdf"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}
