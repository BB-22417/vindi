param()

$ErrorActionPreference = "Stop"

Write-Host "=== Vindi - Setup Script ===" -ForegroundColor Cyan
Write-Host ""

# Prerequisites
Write-Host "Checking prerequisites..."

function Check-Command($cmd, $versionArg) {
  $version = Get-Command $cmd -ErrorAction SilentlyContinue
  if (-not $version) {
    Write-Host "Error: $cmd is not installed. Please install it first." -ForegroundColor Red
    exit 1
  }
  $ver = & $cmd $versionArg 2>&1 | Select-Object -First 1
  Write-Host "  $cmd found: $ver" -ForegroundColor Green
}

Check-Command "node" "--version"
Check-Command "npm" "--version"
Check-Command "git" "--version"

Write-Host ""

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }

# Install backend dependencies
Write-Host ""
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
Set-Location ..

# Install frontend dependencies
Write-Host ""
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
Set-Location ..

# Environment files
Write-Host ""
Write-Host "Setting up environment files..." -ForegroundColor Yellow
if (-not (Test-Path backend\.env)) {
  Copy-Item backend\.env.example backend\.env
  Write-Host "  Created backend/.env from .env.example" -ForegroundColor Green
} else {
  Write-Host "  backend/.env already exists, skipping" -ForegroundColor Yellow
}

# Prisma
Write-Host ""
Write-Host "Running Prisma migrations..." -ForegroundColor Yellow
Set-Location backend
npx prisma generate
if ($LASTEXITCODE -ne 0) { throw "prisma generate failed" }
npx prisma migrate dev --name init --skip-seed 2>$null
if ($LASTEXITCODE -ne 0) {
  npx prisma migrate dev --skip-seed
}
Set-Location ..

# Seed
Write-Host ""
Write-Host "Seeding database..." -ForegroundColor Yellow
Set-Location backend
npx prisma db seed 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "  Seed script skipped (may require database connection)" -ForegroundColor Yellow
}
Set-Location ..

# Done
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Vindi setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "  Backend:  http://localhost:4000" -ForegroundColor Cyan
Write-Host "  API:      http://localhost:4000/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Run 'npm run dev' to start." -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
