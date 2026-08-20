# Convenience wrapper for download-yaml-config.ps1 that defaults to the
# skelterjohnguitar-dev sandbox bucket instead of production.

if (-not $env:PDF_BUCKET) { $env:PDF_BUCKET = 'skelterjohnguitar-dev' }
$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
& (Join-Path $scriptDir 'download-yaml-config.ps1') @args
