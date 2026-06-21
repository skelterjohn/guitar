param(
    [Parameter(Position = 0)]
    [string] $PdfBucket = $(if ($env:PDF_BUCKET) { $env:PDF_BUCKET } elseif ($env:_PDF_BUCKET) { $env:_PDF_BUCKET } else { 'skelterjohnguitar-pdf' }),

    [string] $HiddenDir = $null,

    [switch] $DryRun
)

$ErrorActionPreference = 'Stop'

$repoRoot = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
if (-not $HiddenDir) {
    $HiddenDir = if ($env:HIDDEN_DIR) { $env:HIDDEN_DIR } else { Join-Path $repoRoot 'site\src\data\hidden' }
}

if (-not (Test-Path -LiteralPath $HiddenDir -PathType Container)) {
    Write-Error "hidden directory not found: $HiddenDir"
    exit 1
}

$dirs = Get-ChildItem -LiteralPath $HiddenDir -Directory
if ($dirs.Count -eq 0) {
    Write-Error "no subdirectories found in $HiddenDir"
    exit 1
}

$rsyncMode = if ($DryRun) { '-n' } else { '-d' }

foreach ($dir in $dirs) {
    $src = ($dir.FullName.TrimEnd('\', '/') + '/')
    $dest = "gs://$PdfBucket/$($dir.Name)/"
    Write-Host "Syncing $src -> $dest"
    & gsutil -m rsync -r $rsyncMode $src $dest
}
