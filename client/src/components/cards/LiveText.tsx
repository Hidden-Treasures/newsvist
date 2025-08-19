import TextLoader from "@/helper/TextLoader";
import Link from "next/link";
import React, { FC } from "react";

interface LiveTextProps {
  link: string;
  text: string;
  timestamp?: string;
  color?: boolean;
  loading?: boolean;
}

const LiveText: FC<LiveTextProps> = ({
  link,
  text,
  timestamp,
  color = false,
  loading = false,
}) => {
  return (
    <div className="mb-4">
      {loading ? (
        <TextLoader className="mx-auto text-center !bg-transparent" />
      ) : (
        <Link href={link} className="group">
          <div
            className={`flex flex-col p-3 rounded-md transition-all duration-200 cursor-pointer ${
              color ? "bg-gray-800 hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            <p
              className={`font-medium text-base ${
                color ? "text-white" : "text-gray-800"
              } group-hover:underline`}
            >
              {text}
            </p>
            {timestamp && (
              <span
                className={`text-xs mt-1 ${
                  color ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {timestamp}
              </span>
            )}
          </div>
        </Link>
      )}
    </div>
  );
};

export default LiveText;
