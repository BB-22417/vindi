param(
  [switch]$InstallGit,
  [switch]$SkipBackendCheck
)

$ErrorActionPreference = "Continue"
$VindiDir = Split-Path -Parent $PSScriptRoot

Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║        VINDI - LAUNCH & DEPLOYMENT SCRIPT          ║" -ForegroundColor Cyan
Write-Host "║  AI-Powered Perimenopause Tracking Platform        ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan

# ---- Step 1: Check prerequisites ----
Write-Host "`n[1/7] Checking prerequisites..." -ForegroundColor Yellow
$hasNode = Get-Command node -ErrorAction SilentlyContinue
$hasNpm = Get-Command npm -ErrorAction SilentlyContinue

if (-not $hasNode) { Write-Host "✖ Node.js is required. Install from https://nodejs.org" -ForegroundColor Red; exit 1 }
if (-not $hasNpm) { Write-Host "✖ npm is required." -ForegroundColor Red; exit 1 }

$nodeVer = node -v
$npmVer = npm -v
Write-Host "  ✔ Node.js $nodeVer" -ForegroundColor Green
Write-Host "  ✔ npm $npmVer" -ForegroundColor Green

# ---- Step 2: Install Git if requested ----
Write-Host "`n[2/7] Setting up Git..." -ForegroundColor Yellow
$hasGit = Get-Command git -ErrorAction SilentlyContinue
if (-not $hasGit) {
  if ($InstallGit) {
    Write-Host "  Installing Git via winget..." -ForegroundColor White
    winget install Git.Git -e --silent
    $env:Path += ";C:\Program Files\Git\cmd"
    Write-Host "  ✔ Git installed. Restart terminal to use git commands." -ForegroundColor Green
  } else {
    Write-Host "  ⚠ Git not found. Install it from https://git-scm.com" -ForegroundColor Yellow
    Write-Host "    Then run: git init && git add . && git commit -m 'Initial commit'" -ForegroundColor White
  }
} else {
  if (-not (Test-Path -LiteralPath "$VindiDir\.git")) {
    Set-Location -LiteralPath $VindiDir
    git init
    git add .
    git commit -m "Initial commit: Vindi SaaS platform"
    Write-Host "  ✔ Git repo initialized with initial commit" -ForegroundColor Green
  } else {
    Write-Host "  ✔ Git repo already initialized" -ForegroundColor Green
  }
}

# ---- Step 3: Install dependencies ----
Write-Host "`n[3/7] Installing dependencies..." -ForegroundColor Yellow
Set-Location -LiteralPath "$VindiDir\backend"
Write-Host "  Installing backend dependencies..." -ForegroundColor White
npm install --silent 2>$null
npx prisma generate 2>$null
Write-Host "  ✔ Backend dependencies installed" -ForegroundColor Green

Set-Location -LiteralPath "$VindiDir\frontend"
Write-Host "  Installing frontend dependencies..." -ForegroundColor White
npm install --silent 2>$null
Write-Host "  ✔ Frontend dependencies installed" -ForegroundColor Green

# ---- Step 4: Verify builds ----
Write-Host "`n[4/7] Verifying builds..." -ForegroundColor Yellow
Set-Location -LiteralPath "$VindiDir\backend"
Write-Host "  Building backend..." -ForegroundColor White
npx nest build 2>$null
if ($?) { Write-Host "  ✔ Backend builds successfully" -ForegroundColor Green } else { Write-Host "  ✖ Backend build failed" -ForegroundColor Red }

Set-Location -LiteralPath "$VindiDir\frontend"
Write-Host "  Building frontend..." -ForegroundColor White
npx next build 2>$null
if ($?) { Write-Host "  ✔ Frontend builds successfully" -ForegroundColor Green } else { Write-Host "  ✖ Frontend build failed" -ForegroundColor Red }

# ---- Step 5: Deploy ----
Write-Host "`n[5/7] Deployment..." -ForegroundColor Yellow
Write-Host "  To deploy, you need:"
Write-Host "    1. Railway account (https://railway.app) - for backend + database"
Write-Host "    2. Vercel account (https://vercel.com) - for frontend"
Write-Host "`n  Deploy backend:" -ForegroundColor White
Write-Host "    cd $VindiDir\backend"
Write-Host "    npx railway login"
Write-Host "    npx railway up"
Write-Host "`n  Deploy frontend:" -ForegroundColor White
Write-Host "    cd $VindiDir\frontend"
Write-Host "    npx vercel login"
Write-Host "    npx vercel --prod"

# ---- Step 6: Post-deploy ----
Write-Host "`n[6/7] Post-deployment checklist:" -ForegroundColor Yellow
Write-Host "  [ ] Set environment variables in Railway dashboard"
Write-Host "  [ ] Set environment variables in Vercel dashboard"
Write-Host "  [ ] Run: npx prisma migrate deploy"
Write-Host "  [ ] Run: npx prisma db seed"
Write-Host "  [ ] Update NEXT_PUBLIC_API_URL to Railway backend URL"
Write-Host "  [ ] Configure Stripe webhook endpoint"
Write-Host "  [ ] Configure PayPal webhook endpoint"

# ---- Step 7: Accounts needed ----
Write-Host "`n[7/7] Service accounts you need to create:" -ForegroundColor Yellow
Write-Host "  □ Railway (https://railway.app) - backend hosting + PostgreSQL"
Write-Host "  □ Vercel (https://vercel.com) - frontend hosting"
Write-Host "  □ Supabase (https://supabase.com) - auth + file storage"
Write-Host "  □ Stripe (https://stripe.com) - payment processing"
Write-Host "  □ PayPal (https://developer.paypal.com) - payment processing"
Write-Host "  □ Resend (https://resend.com) - email delivery"

Write-Host "`n╔══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  VINDI is ready to launch!                          ║" -ForegroundColor Cyan
Write-Host "║  Questions? Contact: hello@vindihealth.com          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
