# Download repertoire.yaml and njgo-roster.yaml from gs://BUCKET/ into
# site/src/data/, overwriting the local copies.
#
# Use this after live edits (e.g. via the site's njgo repertoire editor, or
# by hand with gsutil) to pull those changes back into git for versioning,
# before hand-editing further or committing.
#
# Usage:
#   .\download-yaml-config.ps1 [BUCKET]
#   $env:PDF_BUCKET = 'my-bucket'; .\download-yaml-config.ps1

param(
    [Parameter(Position = 0)]
    [string] $PdfBucket = $(if ($env:PDF_BUCKET) { $env:PDF_BUCKET } elseif ($env:_PDF_BUCKET) { $env:_PDF_BUCKET } else { 'skelterjohnguitar-pdf' })
)

$ErrorActionPreference = 'Stop'

$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$dataDir = Join-Path $repoRoot 'site\src\data'

foreach ($name in @('repertoire.yaml', 'njgo-roster.yaml')) {
    $dest = Join-Path $dataDir $name
    Write-Host "Downloading gs://$PdfBucket/$name -> $dest"
    & gsutil cp "gs://$PdfBucket/$name" $dest
}
