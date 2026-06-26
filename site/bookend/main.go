package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

type contextKey string

const userEmailKey contextKey = "userEmail"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		projectID = "skelterjohnguitar"
	}

	ctx := context.Background()
	fbApp, err := firebase.NewApp(ctx, &firebase.Config{ProjectID: projectID})
	if err != nil {
		log.Fatalf("firebase init: %v", err)
	}

	authClient, err := fbApp.Auth(ctx)
	if err != nil {
		log.Fatalf("firebase auth: %v", err)
	}

	srv := &server{auth: authClient}

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowOriginFunc: func(_ *http.Request, origin string) bool {
			switch origin {
			case "http://localhost:5173", "http://127.0.0.1:5173", "https://guitar.skelterjohn.me":
				return true
			default:
				return strings.HasSuffix(origin, ".run.app")
			}
		},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	r.Route("/v1", func(r chi.Router) {
		r.Use(srv.requireAuth)
		r.Get("/whoami", srv.handleWhoami)
	})

	addr := fmt.Sprintf("0.0.0.0:%s", port)
	log.Printf("bookend listening on %s (project=%s)", addr, projectID)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatal(err)
	}
}

type server struct {
	auth *auth.Client
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

func (s *server) handleWhoami(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"email": userEmail(r)})
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}
