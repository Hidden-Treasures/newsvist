"use client";
import React, { ChangeEvent, useState, useEffect } from "react";
import { Colors } from "./Colors";
import Image from "next/image";

const commonFileUI =
  "flex justify-center items-center border border-dashed rounded aspect-video cursor-pointer";

interface FileSelectorProps {
  name: string;
  accept?: string;
  label: string;
  selectedFile?: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function FileSelector({
  name,
  accept = "image/*,video/*",
  label,
  selectedFile,
  className = "",
  onChange,
}: FileSelectorProps) {
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);

  useEffect(() => {
    if (!selectedFile) return;
    if (selectedFile.endsWith(".mp4") || selectedFile.endsWith(".webm")) {
      setFileType("video");
    } else {
      setFileType("image");
    }
  }, [selectedFile]);

  return (
    <div>
      <input
        accept={accept}
        onChange={onChange}
        name={name}
        id={name}
        type="file"
        hidden
      />
      <label htmlFor={name}>
        {selectedFile ? (
          <div
            className={`${commonFileUI} relative overflow-hidden ${className}`}
            style={{ borderColor: Colors.lightSubtle }}
          >
            {fileType === "video" ? (
              <video
                src={selectedFile}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={selectedFile}
                alt="Selected"
                fill
                className="object-cover"
              />
            )}
          </div>
        ) : (
          <FileUI className={className} label={label} />
        )}
      </label>
    </div>
  );
}

interface FileUIProps {
  label: string;
  className?: string;
}

const FileUI = ({ label, className = "" }: FileUIProps) => {
  return (
    <div className={`${commonFileUI} ${className}`}>
      <span style={{ color: Colors.lightSubtle }}>{label}</span>
    </div>
  );
};
