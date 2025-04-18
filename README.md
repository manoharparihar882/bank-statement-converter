# Bank Statement to Excel Converter

A full-stack web application that converts Indian bank statements from PDF to Excel format using AI-powered data extraction.

## Features

- Clean & modern responsive UI
- Upload Indian Bank Statement PDFs (multiple formats: SBI, HDFC, ICICI, etc.)
- Extract transaction data using Python with tabula, pdfplumber, and camelot
- Show table preview after extraction
- Download the converted Excel file
- Automatic file deletion after download
- Dark mode support

## Tech Stack

- **Frontend**: Next.js (React + TailwindCSS)
- **Backend**: Node.js + Express
- **PDF Processing**: Python (tabula, pdfplumber, camelot)
- **Storage**: Temporary file storage with auto-delete functionality

## Installation and Setup (Ubuntu 22.04)

### Prerequisites

- Node.js (v18 or newer)
- Python 3.10 or newer
- Java Runtime Environment (for tabula)

### Step 1: Clone the repository

```bash
git clone https://github.com/yourusername/bank-statement-converter.git
cd bank-statement-converter
```

### Step 2: Install dependencies

#### Backend Dependencies

```bash
cd backend
npm install
```

#### Frontend Dependencies

```bash
cd ../frontend
npm install
```

#### Python Dependencies

```bash
cd ../scripts
pip install -r requirements.txt
```

### Step 3: Create upload and temp directories

```bash
mkdir -p backend/uploads backend/temp
```

### Step 4: Run the application

#### Start the Backend Server

```bash
cd ../backend
npm run dev
```

#### Start the Frontend Server

```bash
cd ../frontend
npm run dev
```

### Step 5: Access the application

Open your browser and navigate to: `http://localhost:3000`

## Usage

1. Upload an Indian bank statement PDF
2. Wait for processing
3. Preview the extracted data
4. Download the Excel file

## Deployment on Ubuntu 22.04

### Prerequisites

- Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

- Install Python and dependencies
```bash
sudo apt update
sudo apt install -y python3-pip python3-dev build-essential libpoppler-cpp-dev pkg-config python3-venv
```

- Install Java (for tabula)
```bash
sudo apt install -y default-jre
```

### Production Deployment

1. Clone the repository:
```bash
git clone https://github.com/yourusername/bank-statement-converter.git
cd bank-statement-converter
```

2. Install and setup the backend:
```bash
cd backend
npm install
mkdir -p uploads temp
```

3. Install Python dependencies:
```bash
cd ../scripts
pip install -r requirements.txt
```

4. Install and build the frontend:
```bash
cd ../frontend
npm install
npm run build
```

5. Setup PM2 for process management:
```bash
sudo npm install -g pm2
cd ../backend
pm2 start server.js --name "bank-statement-backend"
```

6. Setup Nginx as a reverse proxy:
```bash
sudo apt install -y nginx
```

Create an Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/bank-statement-converter
```

Add the following configuration:
```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/bank-statement-converter /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. Setup SSL with Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

8. Start the frontend in production:
```bash
cd ../frontend
pm2 start npm --name "bank-statement-frontend" -- start
```

9. Make PM2 start on boot:
```bash
pm2 startup
pm2 save
```

## License

MIT 