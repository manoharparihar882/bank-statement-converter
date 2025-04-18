#!/bin/bash

# Bank Statement Converter Setup Script for Ubuntu 22.04
echo "Setting up Bank Statement Converter for Ubuntu 22.04"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js is already installed"
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Installing Python..."
    sudo apt update
    sudo apt install -y python3 python3-pip
else
    echo "Python is already installed"
fi

# Install Java Runtime (needed for tabula)
echo "Installing Java Runtime..."
sudo apt update
sudo apt install -y default-jre

# Install required system dependencies
echo "Installing system dependencies..."
sudo apt install -y build-essential libpoppler-cpp-dev pkg-config

# Create necessary directories
echo "Creating directories..."
mkdir -p backend/uploads backend/temp

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
pip3 install -r scripts/requirements.txt

echo "Setup completed successfully!"
echo "To start the application in development mode:"
echo "npm run dev"

# Instructions for production deployment
echo "----------------------------------------"
echo "For production deployment, please follow these steps:"
echo "1. Build the frontend: cd frontend && npm run build"
echo "2. Install PM2: sudo npm install -g pm2"
echo "3. Start the backend: cd backend && pm2 start server.js --name 'bank-statement-backend'"
echo "4. Start the frontend: cd frontend && pm2 start npm --name 'bank-statement-frontend' -- start"
echo "5. Setup Nginx as described in the README.md file"
echo "----------------------------------------" 