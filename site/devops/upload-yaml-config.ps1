# Upload site\src\data\repertoire.yaml and njgo-roster.yaml to
# gs://skelterjohnguitar-pdf/, overwriting the live copies.
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage cp (Join-Path $repoRoot 'site\src\data\repertoire.yaml') gs://skelterjohnguitar-pdf/repertoire.yaml --cache-control=no-cache --content-type=text/yaml
& gcloud storage cp (Join-Path $repoRoot 'site\src\data\njgo-roster.yaml') gs://skelterjohnguitar-pdf/njgo-roster.yaml --cache-control=no-cache --content-type=text/yaml
