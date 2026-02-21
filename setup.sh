#!/bin/bash
# STM32 Workshop – Full Stack Setup Script

set -e
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  STM32 MASTERING WORKSHOP - Setup Script     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ ! -f .env ]; then
  cp .env.example .env
  echo "⚠️  Created backend/.env from template - please edit with your credentials!"
fi
cd ..

# Client
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

# Admin
echo "📦 Installing admin dependencies..."
cd admin
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your MongoDB URI and email credentials"
echo "2. Start backend:  cd backend && npm run dev"
echo "3. Start client:   cd client && npm start   (port 3000)"
echo "4. Start admin:    cd admin && npm start    (port 3001)"
echo ""
echo "Admin login: admin / Admin@STM32#2025"
echo "(Change this in backend/.env before production!)"
