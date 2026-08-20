#!/usr/bin/env bash
set -euo pipefail

# Convenience wrapper for upload-yaml-config.sh that defaults to the
# skelterjohnguitar-dev sandbox bucket instead of production.
export PDF_BUCKET="${PDF_BUCKET:-skelterjohnguitar-dev}"
exec "$(cd "$(dirname "$0")" && pwd)/upload-yaml-config.sh" "$@"
