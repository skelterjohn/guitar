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
  ./download-yaml-config.sh [BUCKET]
  PDF_BUCKET=my-bucket ./download-yaml-config.sh

Environment:
  PDF_BUCKET / _PDF_BUCKET   Bucket name (default: skelterjohnguitar-pdf)
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DATA_DIR="$REPO_ROOT/site/src/data"
PDF_BUCKET="${1:-${PDF_BUCKET:-${_PDF_BUCKET:-skelterjohnguitar-pdf}}}"

for name in repertoire.yaml njgo-roster.yaml; do
  dest="$DATA_DIR/$name"
  echo "Downloading gs://$PDF_BUCKET/$name -> $dest"
  gcloud storage cp "gs://$PDF_BUCKET/$name" "$dest"
done
