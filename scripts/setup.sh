#!/usr/bin/env bash
set -euo pipefail

echo "=== Vindi - Setup Script ==="
echo ""

# Prerequisites
echo "Checking prerequisites..."

check_cmd() {
  if ! command -v "$1" &> /dev/null; then
    echo "Error: $1 is not installed. Please install it first."
    exit 1
  fi
  echo "  ✓ $1 found: $($1 --version 2>&1 | head -1)"
}

check_cmd node
check_cmd npm
check_cmd git

echo ""

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo ""
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Environment files
echo ""
echo "Setting up environment files..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "  Created backend/.env from .env.example"
else
  echo "  backend/.env already exists, skipping"
fi

# Prisma
echo ""
echo "Running Prisma migrations..."
cd backend
npx prisma generate
npx prisma migrate dev --name init --skip-seed 2>/dev/null || npx prisma migrate dev --skip-seed
cd ..

# Seed
echo ""
echo "Seeding database..."
cd backend
npx prisma db seed 2>/dev/null || echo "  Seed script skipped (may require database connection)"
cd ..

# Done
echo ""
echo "================================"
echo "  Vindi setup complete!"
echo ""
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo "  API:      http://localhost:4000/api"
echo ""
echo "  Run 'npm run dev' to start."
echo "================================"
