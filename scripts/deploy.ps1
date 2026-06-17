param(
  [switch]$FrontendOnly,
  [switch]$BackendOnly
)

$ErrorActionPreference = "Stop"
$VindiDir = Split-Path -Parent $PSScriptRoot

Write-Host "=== Vindi Deployment Script ===" -ForegroundColor Cyan

if (-not $BackendOnly) {
  Write-Host "`n--- Deploying Frontend to Vercel ---" -ForegroundColor Yellow
  Set-Location -LiteralPath "$VindiDir\frontend"
  
  $loggedIn = & npx vercel whoami 2>$null
  if (-not $?) {
    Write-Host "You need to log in to Vercel first." -ForegroundColor Red
    Write-Host "Run: npx vercel login" -ForegroundColor White
    exit 1
  }
  
  & npx vercel --prod --yes
  if ($?) { Write-Host "Frontend deployed successfully!" -ForegroundColor Green }
}

if (-not $FrontendOnly) {
  Write-Host "`n--- Deploying Backend to Railway ---" -ForegroundColor Yellow
  Set-Location -LiteralPath "$VindiDir\backend"
  
  $railwayInstalled = & npx railway --version 2>$null
  if (-not $?) {
    Write-Host "Installing Railway CLI..."
    npm install -g @railway/cli
  }
  
  Write-Host "Run: npx railway login" -ForegroundColor White
  Write-Host "Then: npx railway up" -ForegroundColor White
  Write-Host "Then: npx railway domain" -ForegroundColor White
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "`nAfter deploying:" -ForegroundColor Yellow
Write-Host "1. Set environment variables in Vercel dashboard for frontend" -ForegroundColor White
Write-Host "2. Set environment variables in Railway dashboard for backend" -ForegroundColor White
Write-Host "3. Update NEXT_PUBLIC_API_URL in Vercel to point to Railway backend URL" -ForegroundColor White
Write-Host "4. Run DB migrations: cd backend && npx prisma migrate deploy" -ForegroundColor White
Write-Host "5. Run DB seed: cd backend && npx prisma db seed" -ForegroundColor White
