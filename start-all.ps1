# E-Commerce Full Stack Startup (Windows PowerShell)
# Usage: .\start-all.ps1

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

Write-Host "================================" -ForegroundColor Cyan
Write-Host "E-Commerce Full Stack" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Check if Node.js is installed
try {
    $null = node -v
}
catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

function Ensure-EnvFile {
    param(
        [Parameter(Mandatory=$true)][string]$EnvPath,
        [Parameter(Mandatory=$true)][string]$ExamplePath
    )
    if (-not (Test-Path $EnvPath)) {
        if (Test-Path $ExamplePath) {
            Copy-Item $ExamplePath $EnvPath -Force
            Write-Host "✅ Created missing env file: $EnvPath" -ForegroundColor Green
            Write-Host "   Please review and update values before going live." -ForegroundColor Yellow
        } else {
            Write-Host "⚠️ Missing $EnvPath and no example found at $ExamplePath" -ForegroundColor Yellow
        }
    }
}

Ensure-EnvFile -EnvPath "$projectRoot\server\.env" -ExamplePath "$projectRoot\server\.env.example"
Ensure-EnvFile -EnvPath "$projectRoot\client\.env" -ExamplePath "$projectRoot\client\.env.example"

function Get-EnvValueFromFile {
    param(
        [Parameter(Mandatory=$true)][string]$EnvPath,
        [Parameter(Mandatory=$true)][string]$Key
    )
    if (-not (Test-Path $EnvPath)) { return $null }
    $line = (Get-Content $EnvPath | Where-Object { $_ -match "^\s*$Key\s*=" } | Select-Object -First 1)
    if (-not $line) { return $null }
    return ($line -split "=", 2)[1].Trim()
}

# Start MongoDB via Docker (optional, recommended for local dev)
if (Test-Path "$projectRoot\docker-compose.yml") {
    try {
        $null = docker compose version
        Write-Host "Starting MongoDB (Docker)..." -ForegroundColor Yellow
        docker compose up -d | Out-Null
        Write-Host "✅ MongoDB container started (or already running)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Docker not available. Ensure MongoDB is running locally (or install Docker Desktop)." -ForegroundColor Yellow
    }
}

$mongoUri = Get-EnvValueFromFile -EnvPath "$projectRoot\server\.env" -Key "MONGO_URI"
if ($mongoUri -and ($mongoUri -like "mongodb://localhost:*" -or $mongoUri -like "mongodb://127.0.0.1:*")) {
    $mongoPort = 27017
    try {
        $match = [regex]::Match($mongoUri, "mongodb:\/\/(localhost|127\.0\.0\.1):(?<port>\d+)")
        if ($match.Success) { $mongoPort = [int]$match.Groups["port"].Value }
    } catch { }

    $mongoOk = $false
    try {
        $mongoOk = (Test-NetConnection -ComputerName "localhost" -Port $mongoPort -WarningAction SilentlyContinue).TcpTestSucceeded
    } catch { }

    if (-not $mongoOk) {
        Write-Host "" 
        Write-Host "❌ MongoDB is NOT reachable on localhost:$mongoPort" -ForegroundColor Red
        Write-Host "Fix options:" -ForegroundColor Yellow
        Write-Host "  1) Install Docker Desktop and re-run: docker compose up -d" -ForegroundColor Gray
        Write-Host "  2) Install MongoDB Community Server and start the MongoDB service" -ForegroundColor Gray
        Write-Host "  3) Use MongoDB Atlas and set MONGO_URI in server\.env to your cluster URI" -ForegroundColor Gray
        Write-Host ""
    }
}

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Write-Host "Navigate to: $projectRoot\server" -ForegroundColor Gray

$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d server && if not exist node_modules (npm install) && echo Starting backend... && npm run dev" -PassThru
Write-Host "✅ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "Navigate to: $projectRoot\client" -ForegroundColor Gray

$clientProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d client && if not exist node_modules (npm install) && echo Starting Vite dev server... && npm run dev" -PassThru
Write-Host "✅ Frontend started (PID: $($clientProcess.Id))" -ForegroundColor Green

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "🚀 APPLICATION RUNNING!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5173 or http://localhost:5174" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test Credentials:" -ForegroundColor Yellow
Write-Host "  Admin:  admin@ecommerce.com / admin123" -ForegroundColor Gray
Write-Host "  User:   john@ecommerce.com / user123" -ForegroundColor Gray
Write-Host ""
Write-Host "Press Enter to stop servers..." -ForegroundColor Yellow
Read-Host

Write-Host ""
Write-Host "Stopping servers..." -ForegroundColor Yellow
Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $clientProcess.Id -Force -ErrorAction SilentlyContinue
Write-Host "✅ All servers stopped" -ForegroundColor Green
