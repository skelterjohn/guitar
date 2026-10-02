# Download repertoire.yaml from gs://skelterjohnguitar-pdf/ into
# site\src\data\, overwriting the local copy. (njgo-roster.yaml is bundled
# into the site at build time and no longer read from GCS at runtime.)
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage cp gs://skelterjohnguitar-pdf/repertoire.yaml (Join-Path $repoRoot 'site\src\data\repertoire.yaml')
