param(
    [string] $Port = $(if ($env:PORT) { $env:PORT } else { '8081' }),

    [string] $FirebaseProjectId = $(if ($env:FIREBASE_PROJECT_ID) { $env:FIREBASE_PROJECT_ID } else { 'skelterjohnguitar' }),

    # Local dev defaults to a sandbox bucket, never the production buckets.
    [string] $BookBucket = $(if ($env:BOOK_BUCKET) { $env:BOOK_BUCKET } else { 'skelterjohnguitar-dev' }),

    [string] $PdfBucket = $(if ($env:PDF_BUCKET) { $env:PDF_BUCKET } else { 'skelterjohnguitar-dev' }),

    [string] $RepPdfSecretPrefix = $(if ($env:REP_PDF_SECRET_PREFIX) { $env:REP_PDF_SECRET_PREFIX } else { '' }),

    [switch] $SkipBuild
)

$ErrorActionPreference = 'Stop'

$bookendDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$binary = Join-Path $bookendDir 'bookend.exe'

Push-Location $bookendDir
try {
    if (-not $SkipBuild) {
        Write-Host "Building bookend..."
        go build -o $binary .
    } elseif (-not (Test-Path -LiteralPath $binary)) {
        Write-Error "bookend.exe not found; run without -SkipBuild"
        exit 1
    }

    $env:PORT = $Port
    $env:FIREBASE_PROJECT_ID = $FirebaseProjectId
    $env:BOOK_BUCKET = $BookBucket
    $env:PDF_BUCKET = $PdfBucket
    if ($RepPdfSecretPrefix) {
        $env:REP_PDF_SECRET_PREFIX = $RepPdfSecretPrefix
    }

    Write-Host "PORT=$Port"
    Write-Host "FIREBASE_PROJECT_ID=$FirebaseProjectId"
    Write-Host "BOOK_BUCKET=$BookBucket"
    Write-Host "PDF_BUCKET=$PdfBucket"
    if ($env:REP_PDF_SECRET_PREFIX) {
        Write-Host "REP_PDF_SECRET_PREFIX=<set>"
    } else {
        Write-Host "REP_PDF_SECRET_PREFIX not set; njgo pdf uploads will be unavailable"
    }
    if ($env:GOOGLE_APPLICATION_CREDENTIALS) {
        Write-Host "GOOGLE_APPLICATION_CREDENTIALS=$($env:GOOGLE_APPLICATION_CREDENTIALS)"
    } else {
        Write-Host "Using Application Default Credentials (run 'gcloud auth application-default login' if GCS calls fail)"
    }
    Write-Host "Listening on http://localhost:$Port"
    Write-Host ""

    & $binary
} finally {
    Pop-Location
}
