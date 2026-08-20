#!/usr/bin/env bash
set -euo pipefail

# Convenience wrapper for upload-yaml-config.sh that defaults to the
# skelterjohnguitar-dev sandbox bucket instead of production. Pass your own
# --pdf-bucket to override (the real script keeps the last one it sees).
exec "$(cd "$(dirname "$0")" && pwd)/upload-yaml-config.sh" --pdf-bucket skelterjohnguitar-dev "$@"
