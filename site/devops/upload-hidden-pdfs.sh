#!/usr/bin/env bash
# Upload each site/src/data/hidden/<name>/ subdirectory to
# gs://skelterjohnguitar-pdf/<name>/.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
for dir in "$REPO_ROOT"/site/src/data/hidden/*/; do
  name="$(basename "$dir")"
  gcloud storage rsync "$dir" "gs://skelterjohnguitar-pdf/$name/" --recursive
done
