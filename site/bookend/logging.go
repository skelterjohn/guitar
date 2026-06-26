package main

import (
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
)

type responseRecorder struct {
	http.ResponseWriter
	status int
	bytes  int
}

func (r *responseRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

func (r *responseRecorder) Write(b []byte) (int, error) {
	if r.status == 0 {
		r.status = http.StatusOK
	}
	n, err := r.ResponseWriter.Write(b)
	r.bytes += n
	return n, err
}

func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			next.ServeHTTP(w, r)
			return
		}

		start := time.Now()
		rec := &responseRecorder{ResponseWriter: w}
		next.ServeHTTP(rec, r)

		status := rec.status
		if status == 0 {
			status = http.StatusOK
		}

		rpc := rpcSummary(r)
		email := userEmail(r)
		if email != "" {
			log.Printf(
				"rpc method=%s rpc=%s path=%q status=%d bytes=%d duration=%s email=%q",
				r.Method, rpc, r.URL.Path, status, rec.bytes, time.Since(start), email,
			)
			return
		}
		log.Printf(
			"rpc method=%s rpc=%s path=%q status=%d bytes=%d duration=%s",
			r.Method, rpc, r.URL.Path, status, rec.bytes, time.Since(start),
		)
	})
}

func rpcSummary(r *http.Request) string {
	if rc := chi.RouteContext(r.Context()); rc != nil {
		if pattern := rc.RoutePattern(); pattern != "" {
			return pattern
		}
	}
	return r.URL.Path
}
