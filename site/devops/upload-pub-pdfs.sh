#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Upload top-level catalog PDFs to gs://BUCKET/pub/

Only pdf/*.pdf is synced (subdirectories such as hidden/ and arpeggio/ are skipped).

Usage:
  ./upload-pub-pdfs.sh [--pdf-bucket BUCKET] [--pdf-dir DIR] [--dry-run]

Flags:
  --pdf-bucket BUCKET   Bucket name (default: skelterjohnguitar-pdf)
  --pdf-dir DIR         Source directory (default: repo/pdf)
  --dry-run             Preview only, no changes
  -h, --help            Show this help
EOF
}

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PDF_BUCKET="skelterjohnguitar-pdf"
PDF_DIR="$REPO_ROOT/pdf"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pdf-bucket)
      PDF_BUCKET="$2"
      shift 2
      ;;
    --pdf-dir)
      PDF_DIR="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "error: unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

RSYNC_FLAGS=(--recursive --delete-unmatched-destination-objects)
if [[ "$DRY_RUN" == "1" ]]; then
  RSYNC_FLAGS=(--recursive --dry-run)
fi

if [[ ! -d "$PDF_DIR" ]]; then
  echo "error: pdf directory not found: $PDF_DIR" >&2
  exit 1
fi

staging="$(mktemp -d)"
trap 'rm -rf "$staging"' EXIT

cp "$PDF_DIR"/*.pdf "$staging/"
echo "Syncing $staging/ -> gs://$PDF_BUCKET/pub/"
gcloud storage rsync "$staging/" "gs://$PDF_BUCKET/pub/" "${RSYNC_FLAGS[@]}"
