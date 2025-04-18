# Project Structure

This document outlines the structure of the Bank Statement Converter project.

## Directory Structure

```
bank-statement-converter/
├── .gitignore
├── package.json
├── README.md
├── GETTING-STARTED.md
├── PROJECT-STRUCTURE.md
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── next.config.js
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── LoadingState.tsx
│   │   ├── Preview.tsx
│   │   └── ThemeProvider.tsx
│   │
│   └── public/
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── uploads/ (created at runtime)
│   └── temp/ (created at runtime)
│
└── scripts/
    ├── pdf_to_excel.py
    ├── requirements.txt
    └── setup.sh
```

## Component Descriptions

### Frontend

- **app/layout.tsx**: Main layout component with ThemeProvider
- **app/page.tsx**: Main page with file upload and conversion flow
- **components/FileUpload.tsx**: File upload component with drag-and-drop support
- **components/Preview.tsx**: Data preview component with download functionality
- **components/LoadingState.tsx**: Loading animation component
- **components/Header.tsx**: Header with dark mode toggle
- **components/Footer.tsx**: Footer component
- **components/ThemeProvider.tsx**: Dark/light mode context provider

### Backend

- **server.js**: Express server with API endpoints for file upload, conversion, and download
- **uploads/**: Directory for temporarily storing uploaded PDF files
- **temp/**: Directory for temporarily storing converted Excel files

### Scripts

- **pdf_to_excel.py**: Python script for extracting data from PDFs and creating Excel files
- **requirements.txt**: Python dependencies
- **setup.sh**: Setup script for Ubuntu 22.04

## API Endpoints

- **POST /api/upload**: Upload PDF file
- **POST /api/convert**: Convert PDF to Excel
- **GET /api/download/:fileId**: Download converted Excel file
- **DELETE /api/files/:fileId**: Delete files after download

## Workflow

1. User uploads a PDF file through the frontend
2. Frontend sends the file to `/api/upload` endpoint
3. Backend stores the file and returns a fileId
4. Frontend calls `/api/convert` with the fileId
5. Backend processes the PDF using the Python script
6. Backend returns preview data and a download URL
7. Frontend displays the data preview
8. User clicks download to get the Excel file from `/api/download/:fileId`
9. Files are automatically deleted after download or after 1 hour

## Development

- `npm run dev`: Start both frontend and backend in development mode
- `npm run dev:frontend`: Start only the frontend
- `npm run dev:backend`: Start only the backend
- `npm run build`: Build the frontend for production 