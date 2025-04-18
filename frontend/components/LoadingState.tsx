"use client";

interface LoadingStateProps {
  status: 'uploading' | 'processing';
}

export default function LoadingState({ status }: LoadingStateProps) {
  return (
    <div className="card">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="w-16 h-16 mb-4">
          <svg
            className="animate-spin w-full h-full text-primary"
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
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {status === 'uploading' ? 'Uploading your file...' : 'Processing your bank statement...'}
        </h3>
        
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          {status === 'uploading'
            ? 'Please wait while we upload your bank statement PDF.'
            : 'Our AI is extracting transaction data from your bank statement. This may take a moment.'}
        </p>
        
        {status === 'processing' && (
          <div className="mt-6 w-full max-w-sm">
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 