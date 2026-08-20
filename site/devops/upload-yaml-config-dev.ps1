# Convenience wrapper for upload-yaml-config.ps1 that defaults to the
# skelterjohnguitar-dev sandbox bucket instead of production. Pass your own
# -PdfBucket to override.
#
# Uses hashtable splatting (@bucketArgs) rather than array splatting for the
# default: PowerShell only rebinds a "-Name" token as a named parameter when
# it was unquoted at the original call site. A programmatically-built array
# like @('-PdfBucket', 'value') is always quoted string literals, so it
# binds positionally instead — hashtable splatting binds by key regardless.

$scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$bucketArgs = @{}
if ($args -notcontains '-PdfBucket') {
    $bucketArgs['PdfBucket'] = 'skelterjohnguitar-dev'
}
& (Join-Path $scriptDir 'upload-yaml-config.ps1') @bucketArgs @args
