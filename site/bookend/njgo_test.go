package main

import "testing"

func TestValidateNjgoPdfFilename(t *testing.T) {
	valid := []string{
		"asmuth_breakfast_g3_2.pdf",
		"sabet_fireflies_score_1.pdf",
		"a_1.pdf",
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
		"asmuth_breakfast_g3_0.pdf",
		"asmuth_breakfast_g3_v2.pdf",
		"Asmuth_Breakfast_G3_2.pdf",
		"asmuth breakfast g3 2.pdf",
		"asmuth_breakfast_g3_2.txt",
		"../asmuth_breakfast_g3_2.pdf",
		"dir/asmuth_breakfast_g3_2.pdf",
		"asmuth__breakfast_g3_2.pdf",
	}
	for _, name := range invalid {
		if err := validateNjgoPdfFilename(name); err == nil {
			t.Fatalf("%q: expected invalid", name)
		}
	}
}

func TestRepPdfObjectKey(t *testing.T) {
	got := repPdfObjectKey("secretfolder", "asmuth_breakfast_g3_2.pdf")
	want := "secretfolder/asmuth_breakfast_g3_2.pdf"
	if got != want {
		t.Fatalf("got %q, want %q", got, want)
	}
}
