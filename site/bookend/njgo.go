package main

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

const repertoireObjectKey = "repertoire.yaml"
const maxRepertoireYAMLBytes = 2 << 20 // 2 MiB

// njgoEditors is the hardcoded allowlist of emails authorized to edit the
// NJGO repertoire catalog and upload its PDFs. Keep this short and update it
// by redeploying bookend.
var njgoEditors = map[string]bool{
	"jasmuth@gmail.com":        true,
	"steven_sabet@yahoo.com":   true,
	"jaysonmartinez@gmail.com": true,
}

func (s *server) requireNjgoEditor(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		email := strings.ToLower(strings.TrimSpace(userEmail(r)))
		if !njgoEditors[email] {
			writeJSON(w, http.StatusForbidden, map[string]string{"error": "not authorized to edit the njgo repertoire"})
			return
		}
		next.ServeHTTP(w, r)
	})
}

func repPdfObjectKey(secretPrefix, filename string) string {
	return fmt.Sprintf("%s/%s", secretPrefix, filename)
}

func njgoPdfPrefix(secretPrefix string) string {
	return secretPrefix + "/"
}

// njgoPdfFilenamePattern enforces the filename convention used to store
// every upload permanently, e.g. "breakfast_around_3.pdf" (key_part.pdf),
// optionally with a trailing disambiguating letter for a re-upload that
// would otherwise collide (e.g. "breakfast_around_3a.pdf"): lowercase
// letters, digits, and underscores only.
var njgoPdfFilenamePattern = regexp.MustCompile(`^[a-z0-9]+(?:_[a-z0-9]+)*\.pdf$`)

func validateNjgoPdfFilename(filename string) error {
	filename = strings.TrimSpace(filename)
	if filename == "" {
		return errors.New("missing filename")
	}
	if len(filename) > 200 {
		return errors.New("filename is too long")
	}
	if !njgoPdfFilenamePattern.MatchString(filename) {
		return errors.New("filename must look like key_part.pdf (lowercase letters, digits, underscores only)")
	}
	return nil
}

func (s *server) handleGetRepertoire(w http.ResponseWriter, r *http.Request) {
	if s.repStore == nil {
		log.Printf("njgo repertoire get failed: rep store not configured")
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "repertoire storage not configured"})
		return
	}

	reader, err := s.repStore.Read(r.Context(), repertoireObjectKey)
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "repertoire not found"})
			return
		}
		log.Printf("njgo repertoire get failed: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read repertoire"})
		return
	}
	defer reader.Close()

	w.Header().Set("Content-Type", "text/yaml; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	if _, err := io.Copy(w, reader); err != nil {
		log.Printf("njgo repertoire get stream failed: %v", err)
	}
}

func (s *server) handlePostRepertoire(w http.ResponseWriter, r *http.Request) {
	if s.repStore == nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "repertoire storage not configured"})
		return
	}

	body := http.MaxBytesReader(w, r.Body, maxRepertoireYAMLBytes)
	defer body.Close()

	data, err := io.ReadAll(body)
	if err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": "repertoire.yaml too large"})
			return
		}
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "could not read request body"})
		return
	}

	var parsed map[string]any
	if err := yaml.Unmarshal(data, &parsed); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": fmt.Sprintf("invalid YAML: %v", err)})
		return
	}
	if _, ok := parsed["sections"].([]any); !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "repertoire.yaml must have a top-level 'sections' list"})
		return
	}

	if err := s.backupRepertoire(r.Context()); err != nil {
		log.Printf("njgo repertoire backup failed: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not back up existing repertoire"})
		return
	}

	if err := s.repStore.WriteNoCache(r.Context(), repertoireObjectKey, bytes.NewReader(data), "text/yaml; charset=utf-8"); err != nil {
		log.Printf("njgo repertoire save failed: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not save repertoire"})
		return
	}

	log.Printf("njgo repertoire saved by=%q bytes=%d", userEmail(r), len(data))
	w.WriteHeader(http.StatusNoContent)
}

// backupRepertoire copies the current repertoire.yaml (if any) to a
// timestamped object before it gets overwritten, so every save keeps a
// recoverable prior version. A no-op if repertoire.yaml doesn't exist yet.
func (s *server) backupRepertoire(ctx context.Context) error {
	reader, err := s.repStore.Read(ctx, repertoireObjectKey)
	if errors.Is(err, errNotFound) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("read current repertoire: %w", err)
	}
	defer reader.Close()

	data, err := io.ReadAll(reader)
	if err != nil {
		return fmt.Errorf("read current repertoire: %w", err)
	}

	backupKey := fmt.Sprintf("repertoire_%s.yaml", time.Now().UTC().Format("20060102_1504"))
	if err := s.repStore.Write(ctx, backupKey, bytes.NewReader(data), "text/yaml; charset=utf-8"); err != nil {
		return fmt.Errorf("write backup %q: %w", backupKey, err)
	}
	return nil
}

func (s *server) handleListNjgoPdfs(w http.ResponseWriter, r *http.Request) {
	if s.repStore == nil || s.repSecretPrefix == "" {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "repertoire pdf storage not configured"})
		return
	}

	files, err := s.repStore.ListPrefix(r.Context(), njgoPdfPrefix(s.repSecretPrefix))
	if err != nil {
		log.Printf("njgo pdf list failed: %v", err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not list pdfs"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{"files": files})
}

func (s *server) handleUploadNjgoPdf(w http.ResponseWriter, r *http.Request) {
	if s.repStore == nil || s.repSecretPrefix == "" {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "repertoire pdf storage not configured"})
		return
	}

	filename := bookParam(r, "filename")
	if err := validateNjgoPdfFilename(filename); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
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
			log.Printf("njgo pdf upload too large filename=%q limit=%d", filename, maxBytesErr.Limit)
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": "pdf too large"})
			return
		}
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "could not read pdf"})
		return
	}

	objectKey := repPdfObjectKey(s.repSecretPrefix, filename)
	if err := s.repStore.WriteIfAbsent(r.Context(), objectKey, bytes.NewReader(data), contentType); err != nil {
		if errors.Is(err, errAlreadyExists) {
			writeJSON(w, http.StatusConflict, map[string]string{"error": "a file with this name already exists — bump the version number"})
			return
		}
		log.Printf("njgo pdf upload failed filename=%q err=%v", filename, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not store pdf"})
		return
	}

	log.Printf("njgo pdf upload by=%q filename=%q bytes=%d", userEmail(r), filename, len(data))
	w.WriteHeader(http.StatusCreated)
}
