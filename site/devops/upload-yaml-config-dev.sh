#!/usr/bin/env bash
# Upload site/src/data/repertoire.yaml to gs://skelterjohnguitar-dev/,
# overwriting the live copy. (njgo-roster.yaml is bundled into the site at
# build time and no longer read from GCS at runtime.)
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
gcloud storage cp "$REPO_ROOT/site/src/data/repertoire.yaml" gs://skelterjohnguitar-dev/repertoire.yaml --cache-control=no-cache --content-type=text/yaml
