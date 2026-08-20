# Upload site/src/data/repertoire.yaml and njgo-roster.yaml to gs://BUCKET/,
# overwriting the live copies. Sets the same Cache-Control/Content-Type
# headers the old Cloud Build sync step used, so the site's runtime fetch
# (network-first, no browser caching) keeps working correctly.
#
# This is no longer done automatically at deploy time: repertoire.yaml is
# live-edited via the site's njgo editor, and an unconditional deploy-time
# overwrite would silently discard those edits. Run this manually after
# hand-editing either file locally.
#
# Usage:
#   .\upload-yaml-config.ps1 [BUCKET]
#   $env:PDF_BUCKET = 'my-bucket'; .\upload-yaml-config.ps1
#   .\upload-yaml-config.ps1 -DryRun

param(
    [Parameter(Position = 0)]
    [string] $PdfBucket = $(if ($env:PDF_BUCKET) { $env:PDF_BUCKET } elseif ($env:_PDF_BUCKET) { $env:_PDF_BUCKET } else { 'skelterjohnguitar-pdf' }),

    [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$dataDir = Join-Path $repoRoot 'site\src\data'

foreach ($name in @('repertoire.yaml', 'njgo-roster.yaml')) {
    $src = Join-Path $dataDir $name
    $dest = "gs://$PdfBucket/$name"
    if ($DryRun) {
        Write-Host "[dry run] would upload $src -> $dest"
        continue
    }
    Write-Host "Uploading $src -> $dest"
    & gcloud storage cp $src $dest --cache-control=no-cache --content-type=text/yaml
}
