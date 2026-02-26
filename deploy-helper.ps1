# ☁️ E-Commerce Cloud Deployment Helper (Windows)
# This script helps prepare your project for cloud deployment

[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "☁️ CLOUD DEPLOYMENT HELPER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    $null = Get-Command $Command -ErrorAction SilentlyContinue
    return $?
}

# Main Menu
function Show-Menu {
    Write-Host ""
    Write-Host "What do you want to do?" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Build frontend for production" -ForegroundColor Green
    Write-Host "2. Check if all dependencies are installed" -ForegroundColor Green
    Write-Host "3. Show deployment URLs (after deployment)" -ForegroundColor Green
    Write-Host "4. Test backend API connection" -ForegroundColor Green
    Write-Host "5. View deployment guides" -ForegroundColor Green
    Write-Host "6. Exit" -ForegroundColor Gray
    Write-Host ""
    $choice = Read-Host "Enter your choice (1-6)"
    return $choice
}

function Build-Frontend {
    Write-Host ""
    Write-Host "📦 Building frontend for production..." -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "$projectRoot\client\dist") {
        Remove-Item "$projectRoot\client\dist" -Recurse -Force
        Write-Host "✅ Cleared old build files" -ForegroundColor Green
    }
    
    Set-Location "$projectRoot\client"
    
    Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host ""
    Write-Host "🔨 Building..." -ForegroundColor Yellow
    npm run build
    
    Write-Host ""
    if (Test-Path "$projectRoot\client\dist") {
        Write-Host "✅ Build complete! Files ready in: $projectRoot\client\dist" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Upload to Vercel: https://vercel.com" -ForegroundColor White
        Write-Host "2. Or upload to Netlify: https://netlify.com" -ForegroundColor White
    } else {
        Write-Host "❌ Build failed! Check errors above." -ForegroundColor Red
    }
}

function Check-Dependencies {
    Write-Host ""
    Write-Host "🔍 Checking dependencies..." -ForegroundColor Cyan
    Write-Host ""
    
    # Check Node.js
    if (Test-Command node) {
        $nodeVersion = & node -v
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Node.js not found! Download from: https://nodejs.org" -ForegroundColor Red
        return
    }
    
    # Check npm
    if (Test-Command npm) {
        $npmVersion = & npm -v
        Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
    }
    
    # Check server dependencies
    Write-Host ""
    Write-Host "📦 Server packages:" -ForegroundColor Yellow
    Set-Location "$projectRoot\server"
    if (Test-Path "node_modules") {
        Write-Host "✅ Installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Not installed - run: npm install in server folder" -ForegroundColor Yellow
    }
    
    # Check client dependencies
    Write-Host "📦 Client packages:" -ForegroundColor Yellow
    Set-Location "$projectRoot\client"
    if (Test-Path "node_modules") {
        Write-Host "✅ Installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Not installed - run: npm install in client folder" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "✅ All dependencies look good!" -ForegroundColor Green
}

function Show-URLs {
    Write-Host ""
    Write-Host "🌐 YOUR LIVE WEBSITE URLS" -ForegroundColor Cyan
    Write-Host ""
    
    $backendURL = Read-Host "Enter your backend URL (e.g., https://ecommerce-backend.onrender.com)"
    $frontendURL = Read-Host "Enter your frontend URL (e.g., https://ecommerce-client.vercel.app)"
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "📱 FRONTEND (Customer Website)" -ForegroundColor Cyan
    Write-Host "🔗 $frontendURL"
    Write-Host ""
    Write-Host "🛍️ SHOPPING LINKS:" -ForegroundColor Yellow
    Write-Host "  🏠 Home: $frontendURL" -ForegroundColor White
    Write-Host "  🛒 Login: $frontendURL/login" -ForegroundColor White
    Write-Host "  👨‍💼 Admin: $frontendURL/admin" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 BACKEND (Server API)" -ForegroundColor Cyan
    Write-Host "🔗 $backendURL"
    Write-Host ""
    Write-Host "🧪 TEST API:" -ForegroundColor Yellow
    Write-Host "  📦 Products: $backendURL/api/products" -ForegroundColor White
    Write-Host "========================================" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "💾 Save these URLs for future reference!" -ForegroundColor Yellow
    Write-Host ""
    
    $saveToFile = Read-Host "Save to file? (y/n)"
    if ($saveToFile -eq "y") {
        $content = @"
# 🌐 Your Live E-Commerce Website

Generated: $(Get-Date)

## Frontend (Customer Website)
Website: $frontendURL
Admin Panel: $frontendURL/admin
Login: $frontendURL/login

## Backend (API Server)
API: $backendURL
Products Endpoint: $backendURL/api/products

## Test Credentials
Email: admin@ecommerce.com
Password: admin123

---
Generated by Deployment Helper
"@
        $content | Out-File "$projectRoot\LIVE_URLS.md" -Encoding UTF8
        Write-Host "✅ Saved to LIVE_URLS.md" -ForegroundColor Green
    }
}

function Test-Backend {
    Write-Host ""
    Write-Host "🧪 Testing backend connection..." -ForegroundColor Cyan
    Write-Host ""
    
    $backendURL = Read-Host "Enter your backend URL (e.g., https://ecommerce-backend.onrender.com)"
    
    try {
        Write-Host "🔗 Connecting to: $backendURL/api/products" -ForegroundColor Yellow
        $response = Invoke-WebRequest "$backendURL/api/products" -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host ""
        Write-Host "✅ Connection successful!" -ForegroundColor Green
        Write-Host "📦 Products found: $($data.Count)" -ForegroundColor Cyan
        Write-Host ""
        
        if ($data.Count -eq 0) {
            Write-Host "⚠️ No products found - run seed script:" -ForegroundColor Yellow
            Write-Host "MONGO_URI='...' node seedData.js" -ForegroundColor White
        }
    } catch {
        Write-Host "❌ Connection failed!" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "Check:" -ForegroundColor Yellow
        Write-Host "  1. Backend URL is correct" -ForegroundColor White
        Write-Host "  2. Backend is running on Render/Railway" -ForegroundColor White
        Write-Host "  3. MongoDB is connected" -ForegroundColor White
    }
}

function Show-Guides {
    Write-Host ""
    Write-Host "📚 DEPLOYMENT GUIDES" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Read DEPLOYMENT_INSTRUCTIONS.md" -ForegroundColor Green
    Write-Host "2. Use DEPLOYMENT_CHECKLIST.md" -ForegroundColor Green
    Write-Host "3. View DEPLOYMENT_GUIDE.md (local testing)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Files:" -ForegroundColor Yellow
    
    $guides = @(
        "DEPLOYMENT_INSTRUCTIONS.md",
        "DEPLOYMENT_CHECKLIST.md",
        "DEPLOYMENT_GUIDE.md",
        "IMPLEMENTATION_SUMMARY.md"
    )
    
    foreach ($guide in $guides) {
        $path = "$projectRoot\$guide"
        if (Test-Path $path) {
            Write-Host "  ✅ $guide" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $guide (not found)" -ForegroundColor Red
        }
    }
}

# Main Loop
do {
    $choice = Show-Menu
    
    switch ($choice) {
        "1" { Build-Frontend }
        "2" { Check-Dependencies }
        "3" { Show-URLs }
        "4" { Test-Backend }
        "5" { Show-Guides }
        "6" { 
            Write-Host ""
            Write-Host "👋 Goodbye!" -ForegroundColor Cyan
            exit
        }
        default {
            Write-Host "❌ Invalid choice. Please try again." -ForegroundColor Red
        }
    }
} while ($true)
