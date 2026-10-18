# Test verification script for data.js
$dataPath = Join-Path $PSScriptRoot "..\data.js"
if (-not (Test-Path $dataPath)) {
    Write-Error "FAIL: data.js does not exist!"
    exit 1
}

$content = Get-Content $dataPath -Raw

# Check for window.STRATEGIES_DATA or const STRATEGIES_DATA
if ($content -notmatch 'STRATEGIES_DATA\s*=') {
    Write-Error "FAIL: STRATEGIES_DATA definition missing in data.js!"
    exit 1
}

# Extract all "name": "..."
$names = [regex]::Matches($content, '"name":\s*"([^"]+)"')
Write-Output "Total strategies found: $($names.Count)"

if ($names.Count -ne 39) {
    Write-Error "FAIL: Expected 39 strategies, but found $($names.Count)!"
    exit 1
}

# Check that every entry has required fields
$requiredFields = @("id", "name", "capitalTier", "capitalRange", "scriptType", "frequency", "profitTarget", "bookingFrequency", "videoUrl", "sheetUrl", "buyRule", "sellRule")
foreach ($field in $requiredFields) {
    $fieldMatches = [regex]::Matches($content, "`"$field`":")
    if ($fieldMatches.Count -lt 39) {
        Write-Error "FAIL: Field '$field' only has $($fieldMatches.Count) occurrences (expected at least 39)!"
        exit 1
    }
}

Write-Output "SUCCESS: All 39 strategies verified with complete required schema!"
exit 0
