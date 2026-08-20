# Upload site\src\data\repertoire.yaml and njgo-roster.yaml to
# gs://skelterjohnguitar-dev/, overwriting the live copies.
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage cp (Join-Path $repoRoot 'site\src\data\repertoire.yaml') gs://skelterjohnguitar-dev/repertoire.yaml --cache-control=no-cache --content-type=text/yaml
& gcloud storage cp (Join-Path $repoRoot 'site\src\data\njgo-roster.yaml') gs://skelterjohnguitar-dev/njgo-roster.yaml --cache-control=no-cache --content-type=text/yaml
