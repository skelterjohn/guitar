param(
    [Parameter(Position = 0)]
    [string] $PdfBucket = $(if ($env:PDF_BUCKET) { $env:PDF_BUCKET } elseif ($env:_PDF_BUCKET) { $env:_PDF_BUCKET } else { 'skelterjohnguitar-pdf' }),

    [string] $PdfDir = $null,

    [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$repoRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
if (-not $PdfDir) {
    $PdfDir = if ($env:PDF_DIR) { $env:PDF_DIR } else { Join-Path $repoRoot 'pdf' }
}

if (-not (Test-Path -LiteralPath $PdfDir -PathType Container)) {
    Write-Error "pdf directory not found: $PdfDir"
    exit 1
}

$staging = Join-Path ([System.IO.Path]::GetTempPath()) "guitar-pub-pdf-$PID"
New-Item -ItemType Directory -Force -Path $staging | Out-Null

try {
    Copy-Item -Path (Join-Path $PdfDir '*.pdf') -Destination $staging -Force
    $src = ($staging.TrimEnd('\', '/') + '/')
    $dest = "gs://$PdfBucket/pub/"
    $rsyncFlags = if ($DryRun) { @('--recursive', '--dry-run') } else { @('--recursive', '--delete-unmatched-destination-objects') }
    Write-Host "Syncing $src -> $dest"
    & gcloud storage rsync $src $dest @rsyncFlags
} finally {
    Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue
}
