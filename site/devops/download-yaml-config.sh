#!/usr/bin/env bash
# Download repertoire.yaml and njgo-roster.yaml from
# gs://skelterjohnguitar-pdf/ into site/src/data/, overwriting local copies.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
gcloud storage cp gs://skelterjohnguitar-pdf/repertoire.yaml "$REPO_ROOT/site/src/data/repertoire.yaml"
gcloud storage cp gs://skelterjohnguitar-pdf/njgo-roster.yaml "$REPO_ROOT/site/src/data/njgo-roster.yaml"
