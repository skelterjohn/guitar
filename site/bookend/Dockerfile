# Build stage
FROM cgr.dev/chainguard/go:latest AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go test ./...
RUN CGO_ENABLED=0 go build -o /app/bookend .

# Production stage
FROM cgr.dev/chainguard/static:latest
WORKDIR /app
COPY --from=builder /app/bookend .

EXPOSE 8080
ENV PORT=8080
USER nonroot

ENTRYPOINT ["/app/bookend"]
