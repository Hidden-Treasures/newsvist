"use client";
import React, { ChangeEvent, FC } from "react";

const commonVideoUI =
  "flex justify-center items-center border border-dashed rounded aspect-video border-light-subtle cursor-pointer";

interface VideoSelectorProps {
  name: string;
  accept?: string;
  label: string;
  selectedVideo?: string;
  className?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function VideoSelector({
  name,
  accept,
  label,
  selectedVideo,
  className = "",
  onChange,
}: VideoSelectorProps) {
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
        {selectedVideo ? (
          <video
            controls
            className={`${commonVideoUI} object-cover ${className}`}
            src={selectedVideo}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <VideoUI className={className} label={label} />
        )}
      </label>
    </div>
  );
}

interface VideoUIProps {
  label: string;
  className?: string;
}

const VideoUI: FC<VideoUIProps> = ({ label, className = "" }) => {
  return (
    <div className={`${commonVideoUI} ${className}`}>
      <span className="text-light-subtle">{label}</span>
    </div>
  );
};
