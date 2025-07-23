import React, { FC } from "react";

interface ImageLoaderProps {
  className?: string;
}

const SkeletonLoader: FC<ImageLoaderProps> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-red-300 rounded h-8 mb-2"></div>
      <div className="bg-red-300 rounded h-6 mb-2"></div>
      <div className="bg-red-300 rounded h-6 mb-2"></div>
      <div className="bg-red-300 rounded h-6 mb-2"></div>
      <div className="bg-red-300 rounded h-6 mb-2"></div>
    </div>
  );
};

export default SkeletonLoader;
