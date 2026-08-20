#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Upload each subdirectory of site/src/data/hidden/ to the same-named prefix in the PDF bucket.

  site/src/data/hidden/foo/x.pdf  ->  gs://BUCKET/foo/x.pdf

Each hidden subdirectory is rsync'd independently. Local files are uploaded and
replaced when they differ; remote-only files are left in place.

Usage:
  ./upload-hidden-pdfs.sh [--pdf-bucket BUCKET] [--hidden-dir DIR] [--dry-run]

Flags:
  --pdf-bucket BUCKET   Bucket name (default: skelterjohnguitar-pdf)
  --hidden-dir DIR      Source directory (default: repo/site/src/data/hidden)
  --dry-run             Preview only, no changes
  -h, --help            Show this help
EOF
}

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PDF_BUCKET="skelterjohnguitar-pdf"
HIDDEN_DIR="$REPO_ROOT/site/src/data/hidden"
DRY_RUN=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pdf-bucket)
      PDF_BUCKET="$2"
      shift 2
      ;;
    --hidden-dir)
      HIDDEN_DIR="$2"
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

RSYNC_FLAGS=(--recursive)
if [[ "$DRY_RUN" == "1" ]]; then
  RSYNC_FLAGS=(--recursive --dry-run)
fi

if [[ ! -d "$HIDDEN_DIR" ]]; then
  echo "error: hidden directory not found: $HIDDEN_DIR" >&2
  exit 1
fi

shopt -s nullglob
dirs=("$HIDDEN_DIR"/*/)
shopt -u nullglob

if [[ ${#dirs[@]} -eq 0 ]]; then
  echo "error: no subdirectories found in $HIDDEN_DIR" >&2
  exit 1
fi

for dir in "${dirs[@]}"; do
  name="$(basename "${dir%/}")"
  src="${dir%/}/"
  dest="gs://${PDF_BUCKET}/${name}/"
  echo "Syncing $src -> $dest"
  gcloud storage rsync "$src" "$dest" "${RSYNC_FLAGS[@]}"
done
