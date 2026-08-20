#!/usr/bin/env bash
# Upload site/src/data/repertoire.yaml and njgo-roster.yaml to
# gs://skelterjohnguitar-dev/, overwriting the live copies.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
gcloud storage cp "$REPO_ROOT/site/src/data/repertoire.yaml" gs://skelterjohnguitar-dev/repertoire.yaml --cache-control=no-cache --content-type=text/yaml
gcloud storage cp "$REPO_ROOT/site/src/data/njgo-roster.yaml" gs://skelterjohnguitar-dev/njgo-roster.yaml --cache-control=no-cache --content-type=text/yaml
