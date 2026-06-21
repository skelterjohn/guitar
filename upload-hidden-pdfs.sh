#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Upload each subdirectory of site/src/data/hidden/ to the same-named prefix in the PDF bucket.

  site/src/data/hidden/foo/x.pdf  ->  gs://BUCKET/foo/x.pdf

Each hidden subdirectory is rsync'd independently (-d only affects that prefix),
so top-level bucket objects are not removed.

Usage:
  ./upload-hidden-pdfs.sh [BUCKET]
  PDF_BUCKET=my-bucket ./upload-hidden-pdfs.sh

Environment:
  PDF_BUCKET / _PDF_BUCKET   Bucket name (default: skelterjohnguitar-pdf)
  HIDDEN_DIR                 Source directory (default: repo/site/src/data/hidden)
  DRY_RUN=1                  Pass -n to gsutil (preview only, no changes)
EOF
}

ROOT="$(cd "$(dirname "$0")" && pwd)"
HIDDEN_DIR="${HIDDEN_DIR:-$ROOT/site/src/data/hidden}"
PDF_BUCKET="${1:-${PDF_BUCKET:-${_PDF_BUCKET:-skelterjohnguitar-pdf}}}"
RSYNC_MODE=(-d)

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "${DRY_RUN:-}" == "1" ]]; then
  RSYNC_MODE=(-n)
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
  gsutil -m rsync -r "${RSYNC_MODE[@]}" "$src" "$dest"
done
