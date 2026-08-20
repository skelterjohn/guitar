#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Download repertoire.yaml and njgo-roster.yaml from gs://BUCKET/ into
site/src/data/, overwriting the local copies.

Use this after live edits (e.g. via the site's njgo repertoire editor, or
by hand with gcloud storage) to pull those changes back into git for
versioning, before hand-editing further or committing.

Usage:
  ./download-yaml-config.sh [--pdf-bucket BUCKET]

Flags:
  --pdf-bucket BUCKET   Bucket name (default: skelterjohnguitar-pdf)
  -h, --help            Show this help
EOF
}

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DATA_DIR="$REPO_ROOT/site/src/data"
PDF_BUCKET="skelterjohnguitar-pdf"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --pdf-bucket)
      PDF_BUCKET="$2"
      shift 2
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

for name in repertoire.yaml njgo-roster.yaml; do
  dest="$DATA_DIR/$name"
  echo "Downloading gs://$PDF_BUCKET/$name -> $dest"
  gcloud storage cp "gs://$PDF_BUCKET/$name" "$dest"
done
