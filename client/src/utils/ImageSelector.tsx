"use client";
import React, { ChangeEvent } from "react";
import { Colors } from "./Colors";
import Image from "next/image";

const commonImageUI =
  "flex justify-center items-center border border-dashed rounded aspect-video cursor-pointer";

interface ImageSelectorProps {
  name: string;
  accept?: string;
  label: string;
  selectedImage?: string;
  className?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageSelector({
  name,
  accept,
  label,
  selectedImage,
  className = "",
  onChange,
}: ImageSelectorProps) {
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
        {selectedImage ? (
          <div
            className={`${commonImageUI} relative overflow-hidden ${className}`}
            style={{ borderColor: Colors.lightSubtle }}
          >
            <Image
              src={selectedImage}
              alt="Selected"
              fill
              className="object-cover"
              style={{ borderColor: Colors.lightSubtle }}
            />
          </div>
        ) : (
          <ImageUI className={className} label={label} />
        )}
      </label>
    </div>
  );
}

interface ImageUIProps {
  label: string;
  className?: string;
}

const ImageUI = ({ label, className = "" }: ImageUIProps) => {
  return (
    <div className={`${commonImageUI} ${className}`}>
      <span style={{ color: Colors.lightSubtle }}>{label}</span>
    </div>
  );
};
