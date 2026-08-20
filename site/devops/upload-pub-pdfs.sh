#!/usr/bin/env bash
# Upload pdf/*.pdf to gs://skelterjohnguitar-pdf/pub/.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
gcloud storage rsync "$REPO_ROOT/pdf/" gs://skelterjohnguitar-pdf/pub/ --recursive --delete-unmatched-destination-objects
