package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"net/url"
	"path/filepath"
	"strings"
	"unicode"
	"unicode/utf8"

	"github.com/go-chi/chi/v5"
)

var errNotFound = errors.New("not found")

// bookParam returns a URL path parameter with percent-encoding decoded.
// chi hands back the raw (escaped) segment, so e.g. an email arrives as
// "jasmuth%40gmail.com" and must be unescaped to "jasmuth@gmail.com".
func bookParam(r *http.Request, key string) string {
	raw := chi.URLParam(r, key)
	decoded, err := url.PathUnescape(raw)
	if err != nil {
		return raw
	}
	return decoded
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func validateBookEmail(email string) error {
	email = strings.TrimSpace(email)
	if email == "" {
		return errors.New("missing email")
	}
	if strings.Contains(email, "/") || strings.Contains(email, "\\") {
		return errors.New("invalid email")
	}
	at := strings.LastIndex(email, "@")
	if at <= 0 || at >= len(email)-1 {
		return errors.New("invalid email")
	}
	return nil
}

func validateBookFilename(filename string) error {
	filename = strings.TrimSpace(filename)
	if filename == "" {
		return errors.New("missing filename")
	}
	if len(filename) > 1024 {
		return errors.New("filename is too long")
	}
	if filename != filepath.Base(filename) {
		return errors.New("invalid filename")
	}
	if strings.ContainsAny(filename, "/\\") {
		return errors.New("invalid filename")
	}
	if strings.Contains(filename, "..") {
		return errors.New("invalid filename")
	}
	if !utf8.ValidString(filename) {
		return errors.New("invalid filename")
	}
	ext := strings.ToLower(filepath.Ext(filename))
	if ext != ".pdf" {
		return errors.New("filename must end with .pdf")
	}
	base := strings.TrimSuffix(filename, ext)
	if base == "" {
		return errors.New("invalid filename")
	}
	for _, r := range base {
		if r == '\uFFFD' || unicode.IsControl(r) {
			return errors.New("invalid filename")
		}
	}
	return nil
}

func (s *server) handleListBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	files, err := s.store.List(r.Context(), pathEmail)
	if err != nil {
		log.Printf("pdf list failed email=%q err=%v", pathEmail, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not list pdfs"})
		return
	}

	log.Printf("pdf list email=%q count=%d", pathEmail, len(files))
	writeJSON(w, http.StatusOK, map[string]any{"files": files})
}

func (s *server) handleGetBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	filename := bookParam(r, "filename")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateBookFilename(filename); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	reader, err := s.store.Read(r.Context(), bookObjectKey(pathEmail, filename))
	if err != nil {
		if errors.Is(err, errNotFound) {
			log.Printf("pdf download not found email=%q filename=%q", pathEmail, filename)
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "pdf not found"})
			return
		}
		log.Printf("pdf download failed email=%q filename=%q err=%v", pathEmail, filename, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read pdf"})
		return
	}
	defer reader.Close()

	w.Header().Set("Content-Type", "application/pdf")
	w.WriteHeader(http.StatusOK)
	n, copyErr := io.Copy(w, reader)
	if copyErr != nil {
		log.Printf("pdf download stream failed email=%q filename=%q bytes=%d err=%v", pathEmail, filename, n, copyErr)
		return
	}
	log.Printf("pdf download email=%q filename=%q bytes=%d", pathEmail, filename, n)
}

func (s *server) handlePostBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	filename := bookParam(r, "filename")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateBookFilename(filename); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	contentType := strings.TrimSpace(r.Header.Get("Content-Type"))
	if contentType != "" && contentType != "application/pdf" && contentType != "application/octet-stream" {
		writeJSON(w, http.StatusUnsupportedMediaType, map[string]string{"error": "content type must be application/pdf"})
		return
	}
	if contentType == "" {
		contentType = "application/pdf"
	}

	body := http.MaxBytesReader(w, r.Body, maxBookPDFBytes)
	defer body.Close()

	data, err := io.ReadAll(body)
	if err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			log.Printf("pdf upload too large email=%q filename=%q limit=%d", pathEmail, filename, maxBytesErr.Limit)
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": "pdf too large"})
			return
		}
		log.Printf("pdf upload read failed email=%q filename=%q err=%v", pathEmail, filename, err)
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "could not read pdf"})
		return
	}

	usage, err := s.store.Usage(r.Context(), pathEmail)
	if err != nil {
		log.Printf("pdf upload usage failed email=%q err=%v", pathEmail, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not check storage usage"})
		return
	}
	if err := checkStorageQuota(usage, map[string]int64{filename: int64(len(data))}); err != nil {
		log.Printf("pdf upload quota exceeded email=%q filename=%q used=%d incoming=%d", pathEmail, filename, usage.Total, len(data))
		writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": err.Error()})
		return
	}

	if err := s.store.Write(r.Context(), bookObjectKey(pathEmail, filename), bytes.NewReader(data), contentType); err != nil {
		log.Printf("pdf upload failed email=%q filename=%q err=%v", pathEmail, filename, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not store pdf"})
		return
	}

	log.Printf("pdf upload email=%q filename=%q contentType=%q bytes=%d used=%d", pathEmail, filename, contentType, len(data), projectedStorageUsage(usage, map[string]int64{filename: int64(len(data))}))
	w.WriteHeader(http.StatusCreated)
}

func (s *server) handleDeleteBook(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	filename := bookParam(r, "filename")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateBookFilename(filename); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	if err := s.store.Delete(r.Context(), bookObjectKey(pathEmail, filename)); err != nil {
		if errors.Is(err, errNotFound) {
			log.Printf("pdf delete not found email=%q filename=%q", pathEmail, filename)
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "pdf not found"})
			return
		}
		log.Printf("pdf delete failed email=%q filename=%q err=%v", pathEmail, filename, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not delete pdf"})
		return
	}

	log.Printf("pdf delete email=%q filename=%q", pathEmail, filename)
	w.WriteHeader(http.StatusNoContent)
}
