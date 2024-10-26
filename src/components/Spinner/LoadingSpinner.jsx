import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex h-screen items-center justify-start">
      <div className="mx-auto my-auto flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-b-8 border-t-8 border-gray-200"></div>
              <div className="absolute left-0 top-0 h-24 w-24 animate-spin rounded-full border-b-8 border-t-8 border-tertiary-t4"></div>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <h1>Loading</h1>
            <div className="flex items-center justify-center space-x-2">
              <div className="h-2 w-2 animate-bounce rounded-full bg-tertiary-t4 [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-tertiary-t4 [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-tertiary-t4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
