#!/usr/bin/env bash
# Upload pdf/*.pdf to gs://skelterjohnguitar-dev/pub/.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
gcloud storage rsync "$REPO_ROOT/pdf/" gs://skelterjohnguitar-dev/pub/ --recursive --delete-unmatched-destination-objects
