import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full border-t-2 border-b-2 border-gray-500 h-8 w-8"></div>
      <span className="ml-2">Loading...</span>
    </div>
  );
}
