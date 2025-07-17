import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 space-y-4 text-center">
      <div className="bg-red-100 rounded-full p-3">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Oops!</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;