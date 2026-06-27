package main

import (
	"archive/zip"
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
)

func bookZipFilename(email string) string {
	return fmt.Sprintf("bluebridge-%s-export.zip", strings.ToLower(strings.TrimSpace(email)))
}

func writeBookZip(w io.Writer, ctx context.Context, store objectStore, email string) (int, error) {
	files, err := store.List(ctx, email)
	if err != nil {
		return 0, err
	}

	zw := zip.NewWriter(w)
	written := 0

	for _, filename := range files {
		reader, err := store.Read(ctx, bookObjectKey(email, filename))
		if err != nil {
			_ = zw.Close()
			return written, fmt.Errorf("read %q: %w", filename, err)
		}

		header := &zip.FileHeader{
			Name:   filename,
			Method: zip.Store,
		}
		header.SetModTime(time.Now().UTC())

		writer, err := zw.CreateHeader(header)
		if err != nil {
			_ = reader.Close()
			_ = zw.Close()
			return written, err
		}

		if _, err := io.Copy(writer, reader); err != nil {
			_ = reader.Close()
			_ = zw.Close()
			return written, fmt.Errorf("write %q: %w", filename, err)
		}
		if err := reader.Close(); err != nil {
			_ = zw.Close()
			return written, fmt.Errorf("close %q: %w", filename, err)
		}
		written++
	}

	if err := zw.Close(); err != nil {
		return written, err
	}
	return written, nil
}

func (s *server) handleZipBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	w.Header().Set("Content-Type", "application/zip")
	w.Header().Set("Content-Disposition", fmt.Sprintf(`attachment; filename="%s"`, bookZipFilename(pathEmail)))
	w.WriteHeader(http.StatusOK)

	count, err := writeBookZip(w, r.Context(), s.store, pathEmail)
	if err != nil {
		log.Printf("pdf zip failed email=%q count=%d err=%v", pathEmail, count, err)
		return
	}
	log.Printf("pdf zip email=%q count=%d", pathEmail, count)
}
