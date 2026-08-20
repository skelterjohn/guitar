# Download repertoire.yaml and njgo-roster.yaml from
# gs://skelterjohnguitar-dev/ into site\src\data\, overwriting local copies.
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage cp gs://skelterjohnguitar-dev/repertoire.yaml (Join-Path $repoRoot 'site\src\data\repertoire.yaml')
& gcloud storage cp gs://skelterjohnguitar-dev/njgo-roster.yaml (Join-Path $repoRoot 'site\src\data\njgo-roster.yaml')
