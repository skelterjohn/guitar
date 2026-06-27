package main

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"

	"firebase.google.com/go/v4/auth"
)

type contextKey string

const userEmailKey contextKey = "userEmail"

type server struct {
	auth        *auth.Client
	bucket      string
	store       objectStore
	collections collectionStore
	annotations annotationStore
}

func (s *server) requireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		email, err := s.verifyRequest(r)
		if err != nil {
			writeJSON(w, http.StatusUnauthorized, map[string]string{"error": err.Error()})
			return
		}
		ctx := context.WithValue(r.Context(), userEmailKey, email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (s *server) verifyRequest(r *http.Request) (string, error) {
	token := strings.TrimSpace(r.Header.Get("Authorization"))
	if token == "" {
		return "", errors.New("missing authorization token")
	}
	if strings.HasPrefix(strings.ToLower(token), "bearer ") {
		token = strings.TrimSpace(token[7:])
	}
	if token == "" {
		return "", errors.New("missing authorization token")
	}

	decoded, err := s.auth.VerifyIDToken(r.Context(), token)
	if err != nil {
		return "", fmt.Errorf("invalid token: %w", err)
	}

	email, _ := decoded.Claims["email"].(string)
	email = strings.TrimSpace(email)
	if email == "" {
		return "", errors.New("token has no email claim")
	}

	return email, nil
}

func userEmail(r *http.Request) string {
	email, _ := r.Context().Value(userEmailKey).(string)
	return email
}

func emailsEqual(a, b string) bool {
	return strings.EqualFold(strings.TrimSpace(a), strings.TrimSpace(b))
}

func (s *server) requirePathEmail(w http.ResponseWriter, r *http.Request, pathEmail string) bool {
	if !emailsEqual(userEmail(r), pathEmail) {
		writeJSON(w, http.StatusForbidden, map[string]string{"error": "email does not match authenticated user"})
		return false
	}
	return true
}

func (s *server) handleWhoami(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"email": userEmail(r)})
}
