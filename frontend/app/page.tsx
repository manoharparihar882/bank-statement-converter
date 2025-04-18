'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import Preview from '@/components/Preview';
import Footer from '@/components/Footer';
import LoadingState from '@/components/LoadingState';

type FileStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function Home() {
  const [fileStatus, setFileStatus] = useState<FileStatus>('idle');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [fileId, setFileId] = useState<string>('');

  const handleReset = () => {
    setFileStatus('idle');
    setPreviewData([]);
    setErrorMessage('');
    setDownloadUrl('');
    setFileId('');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container flex-grow py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Indian Bank Statement to Excel Converter
          </h1>
          
          <p className="text-center mb-8 text-gray-700 dark:text-gray-300">
            Convert your Indian bank statements from PDF to Excel format with high accuracy
            using AI-powered data extraction.
          </p>
          
          {fileStatus === 'idle' && (
            <FileUpload 
              setFileStatus={setFileStatus} 
              setPreviewData={setPreviewData}
              setErrorMessage={setErrorMessage}
              setDownloadUrl={setDownloadUrl}
              setFileId={setFileId}
            />
          )}
          
          {(fileStatus === 'uploading' || fileStatus === 'processing') && (
            <LoadingState status={fileStatus} />
          )}
          
          {fileStatus === 'success' && previewData.length > 0 && (
            <Preview 
              data={previewData} 
              downloadUrl={downloadUrl} 
              fileId={fileId}
              onReset={handleReset}
            />
          )}
          
          {fileStatus === 'error' && (
            <div className="card border-red-500 border">
              <h2 className="text-xl font-semibold text-red-500 mb-2">Error</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{errorMessage}</p>
              <button 
                onClick={handleReset}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
} 