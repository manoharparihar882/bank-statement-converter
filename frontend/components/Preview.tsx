"use client";

import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface PreviewProps {
  data: any[];
  downloadUrl: string;
  fileId: string;
  onReset: () => void;
}

export default function Preview({ data, downloadUrl, fileId, onReset }: PreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Get the file using axios with responseType blob
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bank-statement-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      // Remove the file and mark as downloaded
      await axios.delete(`/api/files/${fileId}`);
      
      toast.success('Downloaded successfully! The file has been deleted from our servers.');
      setIsDownloading(false);
      
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download the file. Please try again.');
      setIsDownloading(false);
    }
  };
  
  // Function to handle column headers
  const renderHeaders = () => {
    if (data.length === 0) return null;
    
    const headers = Object.keys(data[0]);
    
    return (
      <tr className="bg-gray-100 dark:bg-gray-800">
        {headers.map((header, index) => (
          <th 
            key={index} 
            className="px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
          >
            {header}
          </th>
        ))}
      </tr>
    );
  };
  
  // Function to render table rows
  const renderRows = () => {
    return data.map((row, rowIndex) => (
      <tr 
        key={rowIndex} 
        className={`${rowIndex % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'}`}
      >
        {Object.values(row).map((cell: any, cellIndex) => (
          <td 
            key={cellIndex} 
            className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300"
          >
            {typeof cell === 'number' ? cell.toLocaleString() : cell.toString()}
          </td>
        ))}
      </tr>
    ));
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Preview
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="btn btn-primary flex items-center"
          >
            {isDownloading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Downloading...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Excel
              </>
            )}
          </button>
          
          <button 
            onClick={onReset}
            className="btn bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            New Conversion
          </button>
        </div>
      </div>
      
      <div className="rounded-lg overflow-auto max-h-[400px] border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="sticky top-0">{renderHeaders()}</thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {renderRows()}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>
          <span className="font-medium">Note:</span> All files are automatically deleted from our servers after download.
        </p>
      </div>
    </div>
  );
} 