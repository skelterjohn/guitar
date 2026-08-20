# Download repertoire.yaml and njgo-roster.yaml from gs://BUCKET/ into
# site/src/data/, overwriting the local copies.
#
# Use this after live edits (e.g. via the site's njgo repertoire editor, or
# by hand with gcloud storage) to pull those changes back into git for
# versioning, before hand-editing further or committing.
#
# Usage:
#   .\download-yaml-config.ps1 [-PdfBucket BUCKET]

param(
    [string] $PdfBucket = 'skelterjohnguitar-pdf'
)

$ErrorActionPreference = 'Stop'

$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$dataDir = Join-Path $repoRoot 'site\src\data'

foreach ($name in @('repertoire.yaml', 'njgo-roster.yaml')) {
    $dest = Join-Path $dataDir $name
    Write-Host "Downloading gs://$PdfBucket/$name -> $dest"
    & gcloud storage cp "gs://$PdfBucket/$name" $dest
}
