# Полная выгрузка API 1С без Node.js (curl.exe): все страницы в api-samples/raw, фото — в frontend/data/img.
# Потом: node sync.mjs --from ..\..\api-samples\raw  (на сервере с Node) — собирает catalog.json.
param([int]$Images = 60)
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
$cfg = @{}
Get-Content (Join-Path $here ".env") -Encoding UTF8 | ForEach-Object { if ($_ -match '^\s*([A-Z_]+)\s*=\s*(.*)$') { $cfg[$matches[1]] = $matches[2].Trim() } }
$root = Split-Path -Parent (Split-Path -Parent $here)
$raw = Join-Path $root "api-samples\raw"; New-Item -ItemType Directory -Force -Path $raw | Out-Null
$img = Join-Path $here "..\frontend\data\img"; New-Item -ItemType Directory -Force -Path $img | Out-Null
$log = Join-Path $raw "_log.txt"; "=== $(Get-Date -Format s)" | Set-Content $log -Encoding UTF8
$base = $cfg.BILLING_URL.TrimEnd('/')
$auth = @("-u", "$($cfg.BILLING_USER):$($cfg.BILLING_PASSWORD)", "-H", "X-API-Token: $($cfg.BILLING_TOKEN)")
function Get-Page($path, $file) {
  Start-Sleep -Milliseconds 1100   # лимит API: 60 запросов в минуту
  $code = & curl.exe -s -m 60 -o $file -w "%{http_code}" @auth "$base$path"
  Add-Content $log "$path -> $code" -Encoding UTF8
  return $code
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
foreach ($ep in @("health", "categories", "sets", "products", "prices", "stock")) {
  if ($ep -eq "health") { Get-Page "/health" (Join-Path $raw "health.json") | Out-Null; continue }
  $page = 1
  while ($true) {
    $file = Join-Path $raw ("{0}-{1}.json" -f $ep, $page)
    $code = Get-Page ("/{0}?limit=1000&page={1}" -f $ep, $page) $file
    if ($code -ne "200") { break }
    $j = [System.IO.File]::ReadAllText($file, $utf8) | ConvertFrom-Json
    if ($j.items.Count -eq 0 -or ($page * 1000) -ge $j.total) { break }
    $page++
  }
}
# Фото: первые $Images товаров с фото, у которых есть остаток
$inStock = @{}
Get-ChildItem $raw -Filter "stock-*.json" | ForEach-Object { ([System.IO.File]::ReadAllText($_.FullName, $utf8) | ConvertFrom-Json).items | Where-Object { $_.quantity -gt 0 } | ForEach-Object { $inStock[$_.item_id] = 1 } }
$n = 0
Get-ChildItem $raw -Filter "products-*.json" | ForEach-Object { ([System.IO.File]::ReadAllText($_.FullName, $utf8) | ConvertFrom-Json).items } |
  Where-Object { $_.image_updated_at -and $_.is_active -and $inStock.ContainsKey($_.item_id) } | ForEach-Object {
    if ($n -ge $Images) { return }
    $f = Join-Path $img "$($_.item_id).jpg"
    if (-not (Test-Path $f)) { $c = Get-Page "/products/$($_.item_id)/images" $f; if ($c -ne "200") { Remove-Item $f -ErrorAction SilentlyContinue } }
    $n++
  }
"DONE images=$n" | Add-Content $log -Encoding UTF8
