# Upload each site\src\data\hidden\<name>\ subdirectory to
# gs://skelterjohnguitar-dev/<name>/.
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
foreach ($dir in Get-ChildItem -LiteralPath (Join-Path $repoRoot 'site\src\data\hidden') -Directory) {
    & gcloud storage rsync "$($dir.FullName)\" "gs://skelterjohnguitar-dev/$($dir.Name)/" --recursive
}
