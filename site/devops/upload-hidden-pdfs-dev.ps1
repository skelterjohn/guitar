# Convenience wrapper for upload-hidden-pdfs.ps1 that defaults to the
# skelterjohnguitar-dev sandbox bucket instead of production.

if (-not $env:PDF_BUCKET) { $env:PDF_BUCKET = 'skelterjohnguitar-dev' }
$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
& (Join-Path $scriptDir 'upload-hidden-pdfs.ps1') @args
