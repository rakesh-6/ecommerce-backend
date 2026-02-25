# E-Commerce Full Stack Startup (Windows PowerShell)
# Usage: .\start-all.ps1

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

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Write-Host "Navigate to: $projectRoot\server" -ForegroundColor Gray

$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd server && npm install > nul 2>&1 && echo Starting MongoDB connection... && node server.js" -PassThru
Write-Host "✅ Backend started (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "Navigate to: $projectRoot\client" -ForegroundColor Gray

$clientProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd client && npm install > nul 2>&1 && echo Starting Vite dev server... && npm run dev" -PassThru
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
