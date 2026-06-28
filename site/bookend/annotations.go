package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"
	"strings"
	"unicode"
)

const (
	annotationRasterFormat      = "webp"
	annotationRasterContentType = "image/webp"
	emptyAnnotationRastersHash  = "0"
	maxAnnotationRasterBytes    = 5 << 20  // 5 MiB per raster
	maxAnnotationStoreBytes     = 50 << 20 // 50 MiB per store request
	maxAnnotationRasterFiles    = 500
	maxAnnotationPage           = 9999
)

var annotationLayerSlugByHex = map[string]string{
	"#000000": "black",
	"#16a34a": "green",
	"#2563eb": "blue",
	"#dc2626": "red",
}

func annotationRasterPrefix(email string) string {
	return bookObjectPrefix(email) + "rasters/"
}

func annotationRasterObjectKey(email, rasterName string) string {
	return annotationRasterPrefix(email) + rasterName
}

func annotationRasterFilename(pdf string, page int, layerSlug string) string {
	return fmt.Sprintf("%s-p%d-%s.%s", pdf, page, layerSlug, annotationRasterFormat)
}

func validateAnnotationHash(hash string) error {
	hash = strings.TrimSpace(hash)
	if hash == "" {
		return errors.New("missing hash")
	}
	if len(hash) > 128 {
		return errors.New("hash is too long")
	}
	for _, r := range hash {
		if !unicode.IsLetter(r) && !unicode.IsDigit(r) && r != '-' && r != '_' {
			return errors.New("invalid hash")
		}
	}
	return nil
}

func validateAnnotationLayerSlug(slug string) bool {
	switch slug {
	case "black", "green", "blue", "red":
		return true
	default:
		return false
	}
}

func validateAnnotationColor(color string) error {
	color = strings.TrimSpace(color)
	if color == "" {
		return nil
	}
	if _, ok := annotationLayerSlugByHex[color]; !ok {
		return errors.New("invalid annotation color")
	}
	return nil
}

func validateAnnotationRasterName(name string) error {
	name = strings.TrimSpace(name)
	if name == "" {
		return errors.New("missing raster name")
	}
	if name != strings.Trim(name, "/\\") || strings.ContainsAny(name, "/\\") {
		return errors.New("invalid raster name")
	}
	if strings.Contains(name, "..") {
		return errors.New("invalid raster name")
	}
	suffix := "." + annotationRasterFormat
	if !strings.HasSuffix(strings.ToLower(name), suffix) {
		return errors.New("raster name must end with ." + annotationRasterFormat)
	}
	return nil
}

func parseAnnotationRasterFilename(pdf, name string) (page int, layerSlug string, ok bool) {
	if err := validateAnnotationRasterName(name); err != nil {
		return 0, "", false
	}
	suffix := "." + annotationRasterFormat
	if !strings.HasSuffix(name, suffix) {
		return 0, "", false
	}
	body := strings.TrimSuffix(name, suffix)
	prefix := pdf + "-p"
	if !strings.HasPrefix(body, prefix) {
		return 0, "", false
	}
	rest := body[len(prefix):]
	dash := strings.IndexByte(rest, '-')
	if dash <= 0 {
		return 0, "", false
	}
	page, err := strconv.Atoi(rest[:dash])
	if err != nil || page < 1 || page > maxAnnotationPage {
		return 0, "", false
	}
	layerSlug = rest[dash+1:]
	if !validateAnnotationLayerSlug(layerSlug) {
		return 0, "", false
	}
	return page, layerSlug, true
}

func isEmptyAnnotationRastersHash(hash string) bool {
	return hash == emptyAnnotationRastersHash
}

func parseAnnotationPagesJSON(raw string, allowEmpty bool) (map[string]annotationPageDims, error) {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		if allowEmpty {
			return map[string]annotationPageDims{}, nil
		}
		return nil, errors.New("missing pages metadata")
	}
	var pages map[string]annotationPageDims
	if err := json.Unmarshal([]byte(raw), &pages); err != nil {
		return nil, errors.New("invalid pages metadata")
	}
	if len(pages) == 0 && !allowEmpty {
		return nil, errors.New("missing pages metadata")
	}
	for key, dims := range pages {
		if strings.TrimSpace(key) == "" {
			return nil, errors.New("invalid pages metadata")
		}
		if dims.Width <= 0 || dims.Height <= 0 {
			return nil, fmt.Errorf("invalid dimensions for page %q", key)
		}
	}
	return pages, nil
}

type uploadedAnnotationRaster struct {
	Name   string
	Page   int
	Layer  string
	Width  int
	Height int
	Data   []byte
}

func readAnnotationStoreRequest(w http.ResponseWriter, r *http.Request, pdf string) (hash string, color string, pages map[string]annotationPageDims, uploads []uploadedAnnotationRaster, ok bool) {
	r.Body = http.MaxBytesReader(w, r.Body, maxAnnotationStoreBytes)
	if err := r.ParseMultipartForm(maxAnnotationStoreBytes); err != nil {
		var maxBytesErr *http.MaxBytesError
		if errors.As(err, &maxBytesErr) {
			writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": "annotation upload too large"})
			return "", "", nil, nil, false
		}
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid multipart body"})
		return "", "", nil, nil, false
	}

	hash = strings.TrimSpace(r.FormValue("hash"))
	if err := validateAnnotationHash(hash); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return "", "", nil, nil, false
	}

	color = strings.TrimSpace(r.FormValue("color"))
	if err := validateAnnotationColor(color); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return "", "", nil, nil, false
	}

	parsedPages, err := parseAnnotationPagesJSON(r.FormValue("pages"), isEmptyAnnotationRastersHash(hash))
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return "", "", nil, nil, false
	}

	fileHeaders := r.MultipartForm.File["rasters"]
	if len(fileHeaders) == 0 && !isEmptyAnnotationRastersHash(hash) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "missing raster files"})
		return "", "", nil, nil, false
	}
	if len(fileHeaders) > maxAnnotationRasterFiles {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "too many raster files"})
		return "", "", nil, nil, false
	}

	seenNames := map[string]struct{}{}
	for _, header := range fileHeaders {
		upload, err := readUploadedAnnotationRaster(pdf, parsedPages, header)
		if err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return "", "", nil, nil, false
		}
		if _, exists := seenNames[upload.Name]; exists {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "duplicate raster name"})
			return "", "", nil, nil, false
		}
		seenNames[upload.Name] = struct{}{}
		uploads = append(uploads, upload)
	}

	return hash, color, parsedPages, uploads, true
}

func readUploadedAnnotationRaster(pdf string, pages map[string]annotationPageDims, header *multipart.FileHeader) (uploadedAnnotationRaster, error) {
	name := strings.TrimSpace(header.Filename)
	if err := validateAnnotationRasterName(name); err != nil {
		return uploadedAnnotationRaster{}, err
	}
	page, layerSlug, ok := parseAnnotationRasterFilename(pdf, name)
	if !ok {
		return uploadedAnnotationRaster{}, fmt.Errorf("invalid raster filename %q", name)
	}
	pageKey := strconv.Itoa(page)
	dims, ok := pages[pageKey]
	if !ok {
		return uploadedAnnotationRaster{}, fmt.Errorf("missing page dimensions for page %d", page)
	}

	file, err := header.Open()
	if err != nil {
		return uploadedAnnotationRaster{}, errors.New("could not read raster file")
	}
	defer file.Close()

	limited := io.LimitReader(file, maxAnnotationRasterBytes+1)
	data, err := io.ReadAll(limited)
	if err != nil {
		return uploadedAnnotationRaster{}, errors.New("could not read raster file")
	}
	if len(data) == 0 {
		return uploadedAnnotationRaster{}, fmt.Errorf("empty raster %q", name)
	}
	if len(data) > maxAnnotationRasterBytes {
		return uploadedAnnotationRaster{}, fmt.Errorf("raster %q is too large", name)
	}

	return uploadedAnnotationRaster{
		Name:   name,
		Page:   page,
		Layer:  layerSlug,
		Width:  dims.Width,
		Height: dims.Height,
		Data:   data,
	}, nil
}

func (s *server) handleStoreAnnotationRasters(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	pdf := bookParam(r, "filename")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateBookFilename(pdf); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	hash, color, pages, uploads, ok := readAnnotationStoreRequest(w, r, pdf)
	if !ok {
		return
	}

	incomingSizes := make(map[string]int64, len(uploads))
	for _, upload := range uploads {
		incomingSizes[upload.Name] = int64(len(upload.Data))
	}

	usage, err := s.store.Usage(r.Context(), pathEmail)
	if err != nil {
		log.Printf("annotation store usage failed email=%q pdf=%q err=%v", pathEmail, pdf, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not check storage usage"})
		return
	}
	if err := checkStorageQuota(usage, incomingSizes); err != nil {
		log.Printf("annotation store quota exceeded email=%q pdf=%q err=%v", pathEmail, pdf, err)
		writeJSON(w, http.StatusRequestEntityTooLarge, map[string]string{"error": err.Error()})
		return
	}

	var previous annotationRasterRecord
	var previousNames []string
	if existing, err := s.annotations.GetAnnotationRasters(r.Context(), pathEmail, pdf); err == nil {
		previous = existing
		for _, raster := range existing.Rasters {
			previousNames = append(previousNames, raster.Name)
		}
	} else if !errors.Is(err, errNotFound) {
		log.Printf("annotation store read existing failed email=%q pdf=%q err=%v", pathEmail, pdf, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read existing annotations"})
		return
	}

	record := annotationRasterRecord{
		PDF:   pdf,
		Hash:  hash,
		Color: color,
		Pages: pages,
	}
	for _, upload := range uploads {
		objectKey := annotationRasterObjectKey(pathEmail, upload.Name)
		if err := s.store.Write(r.Context(), objectKey, bytes.NewReader(upload.Data), annotationRasterContentType); err != nil {
			log.Printf("annotation raster write failed email=%q pdf=%q name=%q err=%v", pathEmail, pdf, upload.Name, err)
			writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not store annotation rasters"})
			return
		}
		record.Rasters = append(record.Rasters, annotationRasterFile{
			Name:   upload.Name,
			Page:   upload.Page,
			Layer:  upload.Layer,
			Width:  upload.Width,
			Height: upload.Height,
		})
	}

	if err := s.annotations.PutAnnotationRasters(r.Context(), pathEmail, pdf, record); err != nil {
		log.Printf("annotation metadata write failed email=%q pdf=%q err=%v", pathEmail, pdf, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not store annotation metadata"})
		return
	}

	newNames := make(map[string]struct{}, len(record.Rasters))
	for _, raster := range record.Rasters {
		newNames[raster.Name] = struct{}{}
	}
	for _, oldName := range previousNames {
		if _, keep := newNames[oldName]; keep {
			continue
		}
		if err := s.store.Delete(r.Context(), annotationRasterObjectKey(pathEmail, oldName)); err != nil && !errors.Is(err, errNotFound) {
			log.Printf("annotation raster cleanup failed email=%q pdf=%q name=%q err=%v", pathEmail, pdf, oldName, err)
		}
	}

	log.Printf("annotation store email=%q pdf=%q hash=%q rasters=%d replaced=%d", pathEmail, pdf, hash, len(record.Rasters), len(previous.Rasters))
	writeJSON(w, http.StatusOK, map[string]any{
		"pdf":      pdf,
		"hash":     hash,
		"color":    color,
		"pages":    pages,
		"rasters":  record.Rasters,
	})
}

func (s *server) handleGetAnnotationRasters(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	pdf := bookParam(r, "filename")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateBookFilename(pdf); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	record, err := s.annotations.GetAnnotationRasters(r.Context(), pathEmail, pdf)
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "annotations not found"})
			return
		}
		log.Printf("annotation get failed email=%q pdf=%q err=%v", pathEmail, pdf, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read annotations"})
		return
	}

	clientHash := strings.TrimSpace(r.URL.Query().Get("hash"))
	if clientHash != "" {
		if err := validateAnnotationHash(clientHash); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
			return
		}
		if clientHash == record.Hash {
			writeJSON(w, http.StatusOK, map[string]any{
				"pdf":   pdf,
				"hash":  record.Hash,
				"match": true,
			})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{
			"pdf":     pdf,
			"hash":    record.Hash,
			"match":   false,
			"color":   record.Color,
			"pages":   record.Pages,
			"rasters": record.Rasters,
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"pdf":     pdf,
		"hash":    record.Hash,
		"color":   record.Color,
		"pages":   record.Pages,
		"rasters": record.Rasters,
	})
}

func (s *server) handleGetAnnotationRaster(w http.ResponseWriter, r *http.Request) {
	pathEmail := bookParam(r, "email")
	pdf := bookParam(r, "filename")
	rasterName := bookParam(r, "raster")

	if err := validateBookEmail(pathEmail); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateBookFilename(pdf); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if err := validateAnnotationRasterName(rasterName); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}
	if _, _, ok := parseAnnotationRasterFilename(pdf, rasterName); !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid raster name for pdf"})
		return
	}
	if !s.requirePathEmail(w, r, pathEmail) {
		return
	}

	record, err := s.annotations.GetAnnotationRasters(r.Context(), pathEmail, pdf)
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "annotations not found"})
			return
		}
		log.Printf("annotation raster lookup failed email=%q pdf=%q err=%v", pathEmail, pdf, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read annotations"})
		return
	}

	found := false
	for _, raster := range record.Rasters {
		if raster.Name == rasterName {
			found = true
			break
		}
	}
	if !found {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "raster not found"})
		return
	}

	reader, err := s.store.Read(r.Context(), annotationRasterObjectKey(pathEmail, rasterName))
	if err != nil {
		if errors.Is(err, errNotFound) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "raster not found"})
			return
		}
		log.Printf("annotation raster read failed email=%q pdf=%q name=%q err=%v", pathEmail, pdf, rasterName, err)
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "could not read raster"})
		return
	}
	defer reader.Close()

	w.Header().Set("Content-Type", annotationRasterContentType)
	w.WriteHeader(http.StatusOK)
	if _, err := io.Copy(w, reader); err != nil {
		log.Printf("annotation raster stream failed email=%q pdf=%q name=%q err=%v", pathEmail, pdf, rasterName, err)
	}
}
