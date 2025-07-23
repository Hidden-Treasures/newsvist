import React, { FC } from "react";

interface TextLoaderProps {
  className?: string;
}

const TextLoader: FC<TextLoaderProps> = ({ className = "" }) => {
  return (
    <div role="status" className={`max-w-sm animate-pulse ${className}`}>
      <div className="h-2.5 !bg-gray-200 rounded-full dark:!bg-gray-700 w-48 mb-1" />
      <div className="h-2 !bg-gray-200 rounded-full dark:!bg-gray-700 max-w-[360px] mb-1.5" />
      <div className="h-2 !bg-gray-200 rounded-full dark:!bg-gray-700 mb-2.5" />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TextLoader;
