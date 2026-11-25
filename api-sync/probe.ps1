# Проверка API 1С без Node.js: curl.exe есть в Windows 10/11. Доступы — из .env рядом.
$ErrorActionPreference = "Continue"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$env = @{}
Get-Content (Join-Path $here ".env") -Encoding UTF8 | ForEach-Object {
  if ($_ -match '^\s*([A-Z_]+)\s*=\s*(.*)$') { $env[$matches[1]] = $matches[2].Trim() }
}
$out = Join-Path (Split-Path -Parent (Split-Path -Parent $here)) "api-samples"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$log = Join-Path $out "curl-log.txt"
"=== $(Get-Date -Format s)" | Set-Content $log -Encoding UTF8

function Probe($label, $base, $user, $pass, $token, $path) {
  $name = ($label + $path) -replace '[^\w.-]+', '_'
  $file = Join-Path $out "$name.body"
  $hdr  = Join-Path $out "$name.headers"
  $args = @("-s", "-m", "40", "-o", $file, "-D", $hdr, "-w", "%{http_code} %{time_total}s %{size_download}b %{content_type}", "-u", "$($user):$($pass)")
  if ($token) { $args += @("-H", "X-API-Token: $token") }
  $args += "$base$path"
  $res = & curl.exe @args 2>&1
  $line = "$label $path -> $res"
  Write-Host $line
  Add-Content $log $line -Encoding UTF8
}

$cb = $env.BILLING_URL.TrimEnd('/'); $cu = $env.BILLING_USER; $cp = $env.BILLING_PASSWORD; $ct = $env.BILLING_TOKEN
foreach ($p in @("/health", "/categories?limit=5", "/sets?limit=5", "/products?limit=5", "/prices?limit=5", "/stock?limit=5", "/stock?limit=5&only_positive=true", "/collections?limit=5", "/products?limit=1&page=999")) {
  Probe "catalog" $cb $cu $cp $ct $p
}
Probe "catalog-notoken" $cb $cu $cp "" "/health"
Probe "catalog-badpass" $cb $cu "wrong" $ct "/health"

$sb = $env.STOCK_URL.TrimEnd('/'); $su = $env.STOCK_USER; $sp = $env.STOCK_PASSWORD; $st = $env.STOCK_TOKEN
foreach ($p in @("/products?limit=5&page=1", "/stock?limit=5", "/health")) {
  Probe "stockapi" $sb $su $sp $st $p
}
"DONE" | Add-Content $log
