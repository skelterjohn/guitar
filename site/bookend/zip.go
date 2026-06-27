package main

import (
	"archive/zip"
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

var errZipNoPdfs = errors.New("zip contains no valid pdf files")

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

	for _, file := range files {
		reader, err := store.Read(ctx, bookObjectKey(email, file.Name))
		if err != nil {
			_ = zw.Close()
			return written, fmt.Errorf("read %q: %w", file.Name, err)
		}

		header := &zip.FileHeader{
			Name:   file.Name,
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
			return written, fmt.Errorf("write %q: %w", file.Name, err)
		}
		if err := reader.Close(); err != nil {
			_ = zw.Close()
			return written, fmt.Errorf("close %q: %w", file.Name, err)
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

func ingestBookZip(ctx context.Context, store objectStore, email string, zipData []byte) ([]string, error) {
	reader, err := zip.NewReader(bytes.NewReader(zipData), int64(len(zipData)))
	if err != nil && !errors.Is(err, zip.ErrInsecurePath) {
		return nil, fmt.Errorf("invalid zip: %w", err)
	}
	if len(reader.File) > maxBookZipEntries {
		return nil, fmt.Errorf("zip has too many entries (max %d)", maxBookZipEntries)
	}

	var uploaded []string
	var totalUncompressed int64
	incoming := map[string][]byte{}

	for _, file := range reader.File {
		if file.FileInfo().IsDir() {
			continue
		}

		filename := filepath.Base(filepath.ToSlash(file.Name))
		if filename == "." || filename == ".." {
			continue
		}
		if err := validateBookFilename(filename); err != nil {
			continue
		}

		if file.UncompressedSize64 > uint64(maxBookPDFBytes) {
			return uploaded, fmt.Errorf("%q is too large", filename)
		}
		if file.UncompressedSize64 > 0 {
			totalUncompressed += int64(file.UncompressedSize64)
			if totalUncompressed > maxBookZipUncompressedBytes {
				return uploaded, errors.New("zip uncompressed size exceeds limit")
			}
		}

		rc, err := file.Open()
		if err != nil {
			return uploaded, fmt.Errorf("open %q: %w", filename, err)
		}

		data, err := io.ReadAll(io.LimitReader(rc, maxBookPDFBytes+1))
		_ = rc.Close()
		if err != nil {
			return uploaded, fmt.Errorf("read %q: %w", filename, err)
		}
		if int64(len(data)) > maxBookPDFBytes {
			return uploaded, fmt.Errorf("%q is too large", filename)
		}
		if file.UncompressedSize64 == 0 {
			totalUncompressed += int64(len(data))
			if totalUncompressed > maxBookZipUncompressedBytes {
				return uploaded, errors.New("zip uncompressed size exceeds limit")
			}
		}

		incoming[filename] = data
	}

	if len(incoming) == 0 {
		return nil, errZipNoPdfs
	}

	usage, err := store.Usage(ctx, email)
	if err != nil {
		return nil, err
	}

	incomingSizes := make(map[string]int64, len(incoming))
	for filename, data := range incoming {
		incomingSizes[filename] = int64(len(data))
	}
	if err := checkStorageQuota(usage, incomingSizes); err != nil {
		return nil, err
	}

	for filename, data := range incoming {
		if err := store.Write(ctx, bookObjectKey(email, filename), bytes.NewReader(data), "application/pdf"); err != nil {
			return uploaded, fmt.Errorf("store %q: %w", filename, err)
		}
		uploaded = append(uploaded, filename)
	}

	sort.Strings(uploaded)
	return uploaded, nil
}

func (s *server) handlePostBookZip(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	contentType := strings.TrimSpace(r.Header.Get("Content-Type"))
	if contentType != "" &&
		contentType != "application/zip" &&
		contentType != "application/x-zip-compressed" &&
		contentType != "application/octet-stream" {
		writeJSON(w, http.StatusUnsupportedMediaType, map[string]string{"error": "content type must be application/zip"})
		return
	}

	body := http.MaxBytesReader(w, r.Body, maxBookZipBytes)
	defer body.Close()

	zipData, err := io.ReadAll(body)
	if err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			log.Printf("zip upload too large email=%q limit=%d", pathEmail, maxBytesErr.Limit)
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": "zip too large"})
			return
		}
		log.Printf("zip upload read failed email=%q err=%v", pathEmail, err)
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "could not read zip"})
		return
	}

	files, err := ingestBookZip(r.Context(), s.store, pathEmail, zipData)
	if err != nil {
		if errors.Is(err, errZipNoPdfs) {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		if errors.Is(err, errStorageQuotaExceeded) {
			log.Printf("zip upload quota exceeded email=%q", pathEmail)
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": err.Error()})
			return
		}
		log.Printf("zip ingest failed email=%q err=%v", pathEmail, err)
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	log.Printf("zip upload email=%q count=%d files=%v", pathEmail, len(files), files)
	writeJSON(w, http.StatusCreated, map[string]any{"files": files, "count": len(files)})
}
