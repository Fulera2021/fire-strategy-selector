# End-to-end verification script for FIRE Strategy Selector
$root = Join-Path $PSScriptRoot ".."

$files = @("index.html", "style.css", "data.js", "app.js", "embed-example.html", "README.md")
foreach ($f in $files) {
    $fullPath = Join-Path $root $f
    if (-not (Test-Path $fullPath)) {
        Write-Error "FAIL: Required file missing: $f"
        exit 1
    }
}
Write-Output "SUCCESS: All 6 core files exist."

# Check DOM ID consistency between index.html and app.js
$html = Get-Content (Join-Path $root "index.html") -Raw
$js = Get-Content (Join-Path $root "app.js") -Raw

$idMatches = [regex]::Matches($js, 'getElementById\(''([a-zA-Z0-9_-]+)''\)')
$missingIds = @()
foreach ($m in $idMatches) {
    $id = $m.Groups[1].Value
    if ($html -notmatch ('id="' + $id + '"')) {
        $missingIds += $id
    }
}

if ($missingIds.Count -gt 0) {
    $missingList = $missingIds -join ', '
    Write-Error "FAIL: Missing DOM IDs in index.html: $missingList"
    exit 1
}
Write-Output "SUCCESS: All getElementById DOM IDs verified in index.html."

# Check strategy URLs in data.js
$dataJs = Get-Content (Join-Path $root "data.js") -Raw
$urls = [regex]::Matches($dataJs, '"(videoUrl|sheetUrl)":\s*"([^"]+)"')
Write-Output "Found $($urls.Count) strategy URLs in data.js."

$invalidUrls = @()
foreach ($u in $urls) {
    $val = $u.Groups[2].Value
    if ($val -notmatch '^https?://') {
        $invalidUrls += $val
    }
}

if ($invalidUrls.Count -gt 0) {
    $invalidList = $invalidUrls -join ', '
    Write-Error "FAIL: Invalid URLs found: $invalidList"
    exit 1
}
Write-Output "SUCCESS: All strategy URLs valid."
Write-Output "ALL END-TO-END VERIFICATION CHECKS PASSED!"
exit 0
