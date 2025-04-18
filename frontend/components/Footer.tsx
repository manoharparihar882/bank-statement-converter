export default function Footer() {
  return (
    <footer className="bg-white dark:bg-dark py-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {new Date().getFullYear()} BankExcel AI. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm"
            >
              Contact
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-500">
          <p>
            This service is for educational and convenience purposes. We do not store your bank statements beyond the conversion process. All files are automatically deleted after download.
          </p>
        </div>
      </div>
    </footer>
  );
} 