# Getting Started with Bank Statement Converter

This guide will help you set up and run the Bank Statement to Excel Converter on Ubuntu 22.04.

## Quick Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bank-statement-converter.git
cd bank-statement-converter
```

2. Run the setup script:
```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:
- Install Node.js if not present
- Install Python if not present
- Install Java Runtime (needed for tabula)
- Install required system dependencies
- Create necessary directories
- Install backend, frontend, and Python dependencies

3. Start the development servers:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:3000`

## Manual Setup

If you prefer to set up manually or the setup script doesn't work:

1. Install Node.js (v18 or newer):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

2. Install Python and dependencies:
```bash
sudo apt update
sudo apt install -y python3 python3-pip build-essential libpoppler-cpp-dev pkg-config
```

3. Install Java Runtime Environment (for tabula):
```bash
sudo apt install -y default-jre
```

4. Create necessary directories:
```bash
mkdir -p backend/uploads backend/temp
```

5. Install dependencies:
```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..

# Python
pip3 install -r scripts/requirements.txt
```

6. Start the servers:
```bash
# In one terminal
cd backend
npm run dev

# In another terminal
cd frontend
npm run dev
```

## Common Issues and Solutions

### Issue: Python can't find tabula-py
Solution: Make sure Java is installed and in your PATH
```bash
sudo apt install -y default-jre
```

### Issue: Can't connect to the backend API
Solution: Make sure both servers are running and check next.config.js for correct API URL

### Issue: Permission denied when accessing uploaded files
Solution: Make sure the directories have proper permissions
```bash
chmod -R 755 backend/uploads backend/temp
```

### Issue: Missing Python dependencies
If you encounter any errors about missing Python dependencies:
```bash
sudo apt install -y python3-dev
pip3 install -r scripts/requirements.txt
```

## Production Deployment

For production deployment, follow the detailed instructions in the main README.md file.

## Support

If you need help or have any questions, please open an issue on GitHub. 