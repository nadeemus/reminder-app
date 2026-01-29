#!/bin/bash

# Reminder App - Quick Setup Verification Script
# This script verifies that the project structure is set up correctly

echo "🔍 Reminder App Setup Verification"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check functions
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 exists"
    return 0
  else
    echo -e "${RED}✗${NC} $1 NOT found"
    return 1
  fi
}

check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 exists"
    return 0
  else
    echo -e "${RED}✗${NC} $1 NOT found"
    return 1
  fi
}

# Backend checks
echo "Backend Structure:"
check_dir "backend"
check_file "backend/package.json"
check_file "backend/.env.example"
check_file "backend/src/server.js"
check_file "backend/src/config/database.js"
check_file "backend/src/models/Reminder.js"
check_file "backend/src/routes/reminders.js"
check_file "backend/src/services/cronService.js"
echo ""

# Frontend checks
echo "Frontend Structure:"
check_dir "frontend"
check_file "frontend/package.json"
check_file "frontend/src/App.js"
check_file "frontend/src/index.js"
check_file "frontend/src/components/ReminderList.js"
check_file "frontend/src/components/ReminderForm.js"
check_file "frontend/src/services/api.js"
check_file "frontend/src/utils/notifications.js"
echo ""

# Configuration files
echo "Configuration Files:"
check_file "README.md"
check_file ".gitignore"
check_file "TESTING.md"
echo ""

# Check if dependencies are installed
echo "Dependencies:"
if [ -d "backend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
  echo -e "${YELLOW}⚠${NC} Backend dependencies NOT installed (run: cd backend && npm install)"
fi

if [ -d "frontend/node_modules" ]; then
  echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
  echo -e "${YELLOW}⚠${NC} Frontend dependencies NOT installed (run: cd frontend && npm install)"
fi
echo ""

# Check if .env files exist
echo "Environment Configuration:"
if [ -f "backend/.env" ]; then
  echo -e "${GREEN}✓${NC} Backend .env file exists"
else
  echo -e "${YELLOW}⚠${NC} Backend .env NOT found (copy from .env.example)"
fi

if [ -f "frontend/.env" ]; then
  echo -e "${GREEN}✓${NC} Frontend .env file exists"
else
  echo -e "${YELLOW}⚠${NC} Frontend .env NOT found (optional, defaults to localhost:5000)"
fi
echo ""

echo "=================================="
echo "✨ Verification Complete!"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB is installed and running"
echo "2. Install dependencies if not already installed:"
echo "   cd backend && npm install"
echo "   cd frontend && npm install"
echo "3. Create backend/.env from backend/.env.example"
echo "4. Start the backend: cd backend && npm start"
echo "5. Start the frontend: cd frontend && npm start"
echo ""
echo "For detailed testing instructions, see TESTING.md"
