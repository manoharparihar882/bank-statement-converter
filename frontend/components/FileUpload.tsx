"use client";

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';

interface FileUploadProps {
  setFileStatus: (status: 'idle' | 'uploading' | 'processing' | 'success' | 'error') => void;
  setPreviewData: (data: any[]) => void;
  setErrorMessage: (message: string) => void;
  setDownloadUrl: (url: string) => void;
  setFileId: (id: string) => void;
}

export default function FileUpload({
  setFileStatus,
  setPreviewData,
  setErrorMessage,
  setDownloadUrl,
  setFileId,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setFileStatus('uploading');
      
      // Upload the file
      const uploadResponse = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Failed to upload file');
      }
      
      const { fileId } = uploadResponse.data;
      setFileId(fileId);
      
      // Process the file
      setFileStatus('processing');
      const processResponse = await axios.post('/api/convert', { fileId });
      
      if (!processResponse.data.success) {
        throw new Error(processResponse.data.message || 'Failed to process file');
      }
      
      const { previewData, downloadUrl } = processResponse.data;
      
      setPreviewData(previewData);
      setDownloadUrl(downloadUrl);
      setFileStatus('success');
      
    } catch (error: any) {
      console.error('Error processing file:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
      setFileStatus('error');
    }
  };

  return (
    <div className="card">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-700'
        }`}
      >
        <input {...getInputProps()} />
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 mx-auto mb-4 text-gray-500 dark:text-gray-400"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        
        <p className="mb-2 text-lg font-semibold">
          Drag & drop your bank statement PDF here
        </p>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {isDragActive
            ? "Drop the file here"
            : "or click to select a file (SBI, HDFC, ICICI, and other Indian banks supported)"}
        </p>
        
        {selectedFile && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 mr-2 text-primary"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
              <div className="text-sm font-medium truncate max-w-xs">
                {selectedFile.name}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="text-red-500 hover:text-red-700"
              aria-label="Remove file"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`btn ${
            selectedFile ? 'btn-primary' : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
          }`}
        >
          Convert to Excel
        </button>
      </div>
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p className="text-center font-medium mb-2">Supported Banks:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak", "Bank of Baroda", "Union Bank", "Canara Bank"].map((bank) => (
            <span 
              key={bank}
              className="inline-flex px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800"
            >
              {bank}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 