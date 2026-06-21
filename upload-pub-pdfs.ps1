param(
    [Parameter(Position = 0)]
    [string] $PdfBucket = $(if ($env:PDF_BUCKET) { $env:PDF_BUCKET } elseif ($env:_PDF_BUCKET) { $env:_PDF_BUCKET } else { 'skelterjohnguitar-pdf' }),

    [string] $PdfDir = $null,

    [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

$repoRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
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
    $rsyncMode = if ($DryRun) { '-n' } else { '-d' }
    Write-Host "Syncing $src -> $dest"
    & gsutil -m rsync -r $rsyncMode $src $dest
} finally {
    Remove-Item -LiteralPath $staging -Recurse -Force -ErrorAction SilentlyContinue
}
