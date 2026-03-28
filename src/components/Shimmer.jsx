import React from 'react';

export const Shimmer = () => (
  <div className="w-full flex flex-col items-center gap-6 animate-pulse">
    <div className="h-[600px] w-full max-w-[800px] bg-gray-200 rounded-md shadow-sm"></div>
    <div className="h-4 w-48 bg-gray-200 rounded"></div>
  </div>
);

export const PagePlaceholder = () => (
  <div className="mb-4 shadow-lg relative bg-white animate-pulse">
    <div className="h-[600px] w-full bg-gray-200"></div>
    <div className="mt-2 h-4 w-20 bg-gray-200 mx-auto mb-2"></div>
  </div>
);
