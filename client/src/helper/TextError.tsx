import React, { FC } from "react";

interface TextErrorProps {
  className?: string;
}

const TextError: FC<TextErrorProps> = ({ className = "" }) => {
  return (
    <div role="alert" className={`text-red-700 rounded relative ${className}`}>
      <strong className="font-bold">Failed to load News</strong>
      <br />
      <span className="block sm:inline text-sm">
        {" "}
        Sorry, we couldn't load this post at the moment. Please try again later.
      </span>
      <span className="sr-only">Failed...</span>
    </div>
  );
};

export default TextError;
