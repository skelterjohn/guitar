# Upload pdf/*.pdf to gs://skelterjohnguitar-pdf/pub/.
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage rsync "$repoRoot\pdf\" gs://skelterjohnguitar-pdf/pub/ --recursive --delete-unmatched-destination-objects
