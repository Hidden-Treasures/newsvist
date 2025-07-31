import Image from "next/image";
import React, { FC } from "react";

interface FileType {
  url: string;
  public_id?: string;
  responsive?: string[];
  isVideo?: boolean;
  duration?: string;
}

interface FileDisplayProps {
  file: FileType | null;
  smallImg?: boolean;
  className?: string;
}

const FileDisplay: FC<FileDisplayProps> = ({
  file,
  smallImg = false,
  className = "",
}) => {
  if (!file || !file?.url) {
    return null;
  }

  return (
    <div className={`relative file-display ${className}`}>
      {file.isVideo ? (
        <video
          src={file?.url}
          className="w-full h-auto object-cover rounded"
          controls
        />
      ) : smallImg && file?.responsive ? (
        <picture>
          {file?.responsive?.map((url, index) => (
            <source
              key={index}
              srcSet={url}
              media={`(max-width: ${index * 100}px)`}
            />
          ))}
          <Image
            src={file?.url}
            alt={file?.public_id || "file image"}
            className="rounded"
            width={800}
            height={600}
            unoptimized={true}
          />
        </picture>
      ) : (
        <Image
          src={file?.url}
          alt={file?.public_id || "file image"}
          className="rounded w-fit h-fit object-cover"
          width={800}
          height={600}
          unoptimized={true}
        />
      )}

      {file.isVideo && file.duration && (
        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
          {file.duration}
        </div>
      )}
    </div>
  );
};

export default FileDisplay;
