#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Upload top-level catalog PDFs to gs://BUCKET/pub/

Only pdf/*.pdf is synced (subdirectories such as hidden/ and arpeggio/ are skipped).

Usage:
  ./upload-pub-pdfs.sh [BUCKET]
  PDF_BUCKET=my-bucket ./upload-pub-pdfs.sh

Environment:
  PDF_BUCKET / _PDF_BUCKET   Bucket name (default: skelterjohnguitar-pdf)
  PDF_DIR                      Source directory (default: repo/pdf)
  DRY_RUN=1                    Pass -n to gsutil (preview only, no changes)
EOF
}

ROOT="$(cd "$(dirname "$0")" && pwd)"
PDF_DIR="${PDF_DIR:-$ROOT/pdf}"
PDF_BUCKET="${1:-${PDF_BUCKET:-${_PDF_BUCKET:-skelterjohnguitar-pdf}}}"
RSYNC_MODE=(-d)

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "${DRY_RUN:-}" == "1" ]]; then
  RSYNC_MODE=(-n)
fi

if [[ ! -d "$PDF_DIR" ]]; then
  echo "error: pdf directory not found: $PDF_DIR" >&2
  exit 1
fi

staging="$(mktemp -d)"
trap 'rm -rf "$staging"' EXIT

cp "$PDF_DIR"/*.pdf "$staging/"
echo "Syncing $staging/ -> gs://$PDF_BUCKET/pub/"
gsutil -m rsync -r "${RSYNC_MODE[@]}" "$staging/" "gs://$PDF_BUCKET/pub/"
