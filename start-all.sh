#!/bin/bash
# Start entire application (Mac/Linux)

echo "================================"
echo "E-Commerce Full Stack"
echo "================================"
echo ""

# Navigate to project
cd "$(dirname "$0")"

# Ensure env files exist (copy examples on first run)
if [ ! -f "server/.env" ] && [ -f "server/.env.example" ]; then
  cp "server/.env.example" "server/.env"
  echo "✅ Created missing env file: server/.env (review values before going live)"
fi

if [ ! -f "client/.env" ] && [ -f "client/.env.example" ]; then
  cp "client/.env.example" "client/.env"
  echo "✅ Created missing env file: client/.env (review values before going live)"
fi

# Start MongoDB via Docker (optional, recommended for local dev)
if [ -f "docker-compose.yml" ] && command -v docker >/dev/null 2>&1; then
  if docker compose version >/dev/null 2>&1; then
    echo "Starting MongoDB (Docker)..."
    docker compose up -d >/dev/null 2>&1 || true
    echo "✅ MongoDB container started (or already running)"
  fi
fi

# Start backend in background
echo "Starting Backend Server..."
cd server
if [ ! -d "node_modules" ]; then npm install; fi
npm run dev &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 3

# Start frontend in new terminal
echo "Starting Frontend Server..."
cd ../client
if [ ! -d "node_modules" ]; then npm install; fi
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"
echo ""

echo "================================"
echo "🚀 Application Running!"
echo "================================"
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173 (or 5174)"
echo ""
echo "Admin Email: admin@ecommerce.com"
echo "Admin Pass:  admin123"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
wait
