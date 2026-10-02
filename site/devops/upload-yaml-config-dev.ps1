# Upload site\src\data\repertoire.yaml to gs://skelterjohnguitar-dev/,
# overwriting the live copy. (njgo-roster.yaml is bundled into the site at
# build time and no longer read from GCS at runtime.)
$repoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
& gcloud storage cp (Join-Path $repoRoot 'site\src\data\repertoire.yaml') gs://skelterjohnguitar-dev/repertoire.yaml --cache-control=no-cache --content-type=text/yaml
