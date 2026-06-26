package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	firebase "firebase.google.com/go/v4"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	projectID := os.Getenv("FIREBASE_PROJECT_ID")
	if projectID == "" {
		projectID = "skelterjohnguitar"
	}

	bookBucket := strings.TrimSpace(os.Getenv("BOOK_BUCKET"))

	ctx := context.Background()
	fbApp, err := firebase.NewApp(ctx, &firebase.Config{ProjectID: projectID})
	if err != nil {
		log.Fatalf("firebase init: %v", err)
	}

	authClient, err := fbApp.Auth(ctx)
	if err != nil {
		log.Fatalf("firebase auth: %v", err)
	}

	store, err := newGCSStore(ctx, bookBucket)
	if err != nil {
		log.Fatalf("storage init: %v", err)
	}

	collections, err := newFirestoreCollectionStore(ctx, fbApp)
	if err != nil {
		log.Fatalf("firestore init: %v", err)
	}

	srv := &server{
		auth:        authClient,
		bucket:      bookBucket,
		store:       store,
		collections: collections,
	}

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowOriginFunc: func(_ *http.Request, origin string) bool {
			switch origin {
			case "http://localhost:5173", "http://127.0.0.1:5173", "https://guitar.skelterjohn.me", "https://bluebridge.skelterjohn.me":
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
	r.Use(requestLogger)

	r.Get("/healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("ok"))
	})

	r.Route("/v1", func(r chi.Router) {
		r.Use(srv.requireAuth)
		r.Get("/whoami", srv.handleWhoami)
		r.Get("/book/{email}", srv.handleListBook)
		r.Get("/book/{email}/{filename}", srv.handleGetBook)
		r.Post("/book/{email}/{filename}", srv.handlePostBook)

		r.Get("/users/{email}", srv.handleGetUserCollection)
		r.Get("/users/{email}/books/{book}/piece/{piece}/parts/{part}", srv.handleGetCollectionPart)
		r.Post("/users/{email}/books/{book}/piece/{piece}/parts/{part}", srv.handlePostCollectionPart)
	})

	addr := fmt.Sprintf("0.0.0.0:%s", port)
	log.Printf("bookend listening on %s (project=%s bucket=%s)", addr, projectID, bookBucket)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatal(err)
	}
}
