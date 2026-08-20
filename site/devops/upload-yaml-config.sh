#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Upload site/src/data/repertoire.yaml and njgo-roster.yaml to gs://BUCKET/,
overwriting the live copies. Sets the same Cache-Control/Content-Type
headers the old Cloud Build sync step used, so the site's runtime fetch
(network-first, no browser caching) keeps working correctly.

This is no longer done automatically at deploy time: repertoire.yaml is
live-edited via the site's njgo editor, and an unconditional deploy-time
overwrite would silently discard those edits. Run this manually after
hand-editing either file locally.

Usage:
  ./upload-yaml-config.sh [BUCKET]
  PDF_BUCKET=my-bucket ./upload-yaml-config.sh
  DRY_RUN=1 ./upload-yaml-config.sh

Environment:
  PDF_BUCKET / _PDF_BUCKET   Bucket name (default: skelterjohnguitar-pdf)
  DRY_RUN=1                  Print what would run without uploading
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
  src="$DATA_DIR/$name"
  dest="gs://$PDF_BUCKET/$name"
  if [[ "${DRY_RUN:-}" == "1" ]]; then
    echo "[dry run] would upload $src -> $dest"
    continue
  fi
  echo "Uploading $src -> $dest"
  gcloud storage cp "$src" "$dest" --cache-control=no-cache --content-type=text/yaml
done
