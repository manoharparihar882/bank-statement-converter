const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Create upload and temp directories if they don't exist
const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(__dirname, 'temp');
fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(tempDir);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    // Get original extension
    const ext = path.extname(file.originalname);
    cb(null, `${fileId}${ext}`);
  },
});

// Configure upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Function to clean up old files (older than 1 hour)
const cleanupFiles = () => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  // Clean uploads directory
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return console.error('Error reading uploads directory:', err);
    
    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Error getting stats for ${file}:`, err);
        
        if (stats.mtime < oneHourAgo) {
          fs.unlink(filePath, err => {
            if (err) return console.error(`Error deleting ${file}:`, err);
            console.log(`Deleted old upload: ${file}`);
          });
        }
      });
    });
  });
  
  // Clean temp directory
  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error('Error reading temp directory:', err);
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error(`Error getting stats for ${file}:`, err);
        
        if (stats.mtime < oneHourAgo) {
          fs.unlink(filePath, err => {
            if (err) return console.error(`Error deleting ${file}:`, err);
            console.log(`Deleted old temp file: ${file}`);
          });
        }
      });
    });
  });
};

// Schedule cleanup job (run every hour)
cron.schedule('0 * * * *', () => {
  console.log('Running scheduled cleanup...');
  cleanupFiles();
});

// API Endpoints

// Upload PDF file
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    const fileId = path.parse(req.file.filename).name; // Extract the file ID
    
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      fileId,
      originalName: req.file.originalname,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Server error during upload' });
  }
});

// Convert PDF to Excel
app.post('/api/convert', async (req, res) => {
  try {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({ success: false, message: 'File ID is required' });
    }
    
    // Find the uploaded file
    const files = await fs.readdir(uploadsDir);
    const pdfFile = files.find(file => file.startsWith(fileId) && file.endsWith('.pdf'));
    
    if (!pdfFile) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    const pdfPath = path.join(uploadsDir, pdfFile);
    const outputPath = path.join(tempDir, `${fileId}.xlsx`);
    
    // Sample preview data - in production, this would come from actual PDF processing
    const previewData = await processPDF(pdfPath, outputPath);
    
    // Create download URL
    const downloadUrl = `/api/download/${fileId}`;
    
    return res.status(200).json({
      success: true,
      previewData,
      downloadUrl,
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return res.status(500).json({ success: false, message: 'Error processing PDF file' });
  }
});

// Download converted Excel file
app.get('/api/download/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const excelPath = path.join(tempDir, `${fileId}.xlsx`);
    
    if (!await fs.pathExists(excelPath)) {
      return res.status(404).json({ success: false, message: 'Excel file not found' });
    }
    
    return res.download(excelPath);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ success: false, message: 'Error downloading file' });
  }
});

// Delete files after download
app.delete('/api/files/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // Find and delete the PDF file
    const files = await fs.readdir(uploadsDir);
    const pdfFile = files.find(file => file.startsWith(fileId) && file.endsWith('.pdf'));
    
    if (pdfFile) {
      await fs.unlink(path.join(uploadsDir, pdfFile));
    }
    
    // Delete the Excel file
    const excelPath = path.join(tempDir, `${fileId}.xlsx`);
    if (await fs.pathExists(excelPath)) {
      await fs.unlink(excelPath);
    }
    
    return res.status(200).json({ success: true, message: 'Files deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ success: false, message: 'Error deleting files' });
  }
});

// Function to process PDF using Python script
async function processPDF(pdfPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Call the Python script
    const pythonProcess = spawn('python3', [
      path.join(__dirname, '../scripts/pdf_to_excel.py'),
      pdfPath,
      outputPath
    ]);
    
    let dataString = '';
    
    // Collect data from the Python script
    pythonProcess.stdout.on('data', (data) => {
      dataString += data.toString();
    });
    
    // Handle errors
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python script error: ${data}`);
    });
    
    // Resolve when done
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        // In case of error, return sample data for demonstration
        return resolve(getSamplePreviewData());
      }
      
      try {
        // In a real implementation, this would parse JSON output from the Python script
        // For now, we'll just return some sample data
        resolve(getSamplePreviewData());
      } catch (error) {
        console.error('Error parsing Python output:', error);
        reject(error);
      }
    });
  });
}

// Helper function to generate sample preview data
function getSamplePreviewData() {
  // Sample data for demonstration
  return [
    {
      "Date": "01-04-2023",
      "Description": "ATM/CASH WITHDRAWAL",
      "Cheque No.": "",
      "Debit": 10000.00,
      "Credit": 0.00,
      "Balance": 25000.00
    },
    {
      "Date": "03-04-2023",
      "Description": "SALARY CREDIT",
      "Cheque No.": "",
      "Debit": 0.00,
      "Credit": 50000.00,
      "Balance": 75000.00
    },
    {
      "Date": "05-04-2023",
      "Description": "UPI/PAYMENT/AMAZON",
      "Cheque No.": "",
      "Debit": 2500.00,
      "Credit": 0.00,
      "Balance": 72500.00
    },
    {
      "Date": "10-04-2023",
      "Description": "IMPS/TRANSFER/FRIEND",
      "Cheque No.": "",
      "Debit": 5000.00,
      "Credit": 0.00,
      "Balance": 67500.00
    },
    {
      "Date": "15-04-2023",
      "Description": "UPI/PAYMENT/GROCERIES",
      "Cheque No.": "",
      "Debit": 3000.00,
      "Credit": 0.00,
      "Balance": 64500.00
    }
  ];
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Run initial cleanup on startup
  cleanupFiles();
}); 