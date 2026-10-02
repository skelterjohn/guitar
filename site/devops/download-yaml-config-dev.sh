#!/usr/bin/env bash
# Download repertoire.yaml from gs://skelterjohnguitar-dev/ into
# site/src/data/, overwriting the local copy. (njgo-roster.yaml is bundled
# into the site at build time and no longer read from GCS at runtime.)
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
gcloud storage cp gs://skelterjohnguitar-dev/repertoire.yaml "$REPO_ROOT/site/src/data/repertoire.yaml"
