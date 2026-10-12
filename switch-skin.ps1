# Run example .\switch-skin.ps1 old new

param(
    [Parameter(Mandatory=$true)]
    [string]$CurrentClient,

    [Parameter(Mandatory=$true)]
    [string]$NewClient
)

$layoutsPath = "src\layouts"
$currentRegistry = "skins\$CurrentClient"
$newRegistry = "skins\$NewClient"

$files = @(
    "home.json",
    "plp.json",
    "pdp.json",
    "chat.json"
)

Write-Host "Saving current layouts to registry for $CurrentClient..." -ForegroundColor Cyan

# Ensure registry folder exists
if (!(Test-Path $currentRegistry)) {
    New-Item -ItemType Directory -Path $currentRegistry | Out-Null
}

foreach ($file in $files) {

    $layoutFile = Join-Path $layoutsPath $file
    $registryFile = Join-Path $currentRegistry $file

    if (Test-Path $layoutFile) {
        Copy-Item $layoutFile $registryFile -Force
        Write-Host "Saved $file to $CurrentClient registry"
    }
}

Write-Host ""
Write-Host "Applying layouts for $NewClient..." -ForegroundColor Yellow

if (!(Test-Path $newRegistry)) {
    Write-Host "Registry for $NewClient not found!" -ForegroundColor Red
    exit
}

foreach ($file in $files) {

    $layoutFile = Join-Path $layoutsPath $file
    $registryFile = Join-Path $newRegistry $file

    if (Test-Path $registryFile) {
        Copy-Item $registryFile $layoutFile -Force
        Write-Host "Applied $file from $NewClient"
    }
}

Write-Host ""
Write-Host "Skin switched: $CurrentClient -> $NewClient" -ForegroundColor Green