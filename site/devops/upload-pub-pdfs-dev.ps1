# Upload pdf/*.pdf to gs://skelterjohnguitar-dev/pub/.
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage rsync "$repoRoot\pdf\" gs://skelterjohnguitar-dev/pub/ --recursive --delete-unmatched-destination-objects
