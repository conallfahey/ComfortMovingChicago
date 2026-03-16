param(
  [string]$Root = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

$fullRoot = (Resolve-Path -LiteralPath $Root).Path
$files = Get-ChildItem -LiteralPath $fullRoot -Recurse -File -Filter *.html

$changed = 0
foreach ($file in $files) {
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  $skip = 0
  while ($bytes.Length -ge ($skip + 3) -and $bytes[$skip] -eq 0xEF -and $bytes[$skip + 1] -eq 0xBB -and $bytes[$skip + 2] -eq 0xBF) {
    $skip += 3
  }

  if ($skip -gt 0) {
    if ($bytes.Length -eq $skip) {
      [System.IO.File]::WriteAllBytes($file.FullName, [byte[]]@())
    } else {
      [byte[]]$newBytes = $bytes[$skip..($bytes.Length - 1)]
      [System.IO.File]::WriteAllBytes($file.FullName, $newBytes)
    }
    $changed++
  }
}

Write-Output ("Scanned {0} HTML files under: {1}" -f $files.Count, $fullRoot)
Write-Output ("Removed UTF-8 BOM from {0} file(s)." -f $changed)
