#!/bin/bash
# Start entire application (Mac/Linux)

echo "================================"
echo "E-Commerce Full Stack"
echo "================================"
echo ""

# Navigate to project
cd "$(dirname "$0")"

# Start backend in background
echo "Starting Backend Server..."
cd server
npm install > /dev/null 2>&1
node server.js &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Wait for backend to start
sleep 3

# Start frontend in new terminal
echo "Starting Frontend Server..."
cd ../client
npm install > /dev/null 2>&1
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
