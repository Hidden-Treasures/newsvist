import React, { FC, SyntheticEvent } from "react";

interface MediaFile {
  url: string;
  [key: string]: any;
}

interface VideoDisplayProps {
  video?: MediaFile | null;
  image?: MediaFile;
  className?: string;
  handleLoadedMetadata?: (
    event: SyntheticEvent<HTMLVideoElement, Event>
  ) => void;
  showControls?: boolean;
  playVideo?: boolean;
}

const VideoDisplay: FC<VideoDisplayProps> = ({
  video,
  image,
  className,
  handleLoadedMetadata,
  showControls = true,
  playVideo = false,
}) => {
  if (!video || !video.url) {
    return null;
  }

  return (
    <div className={`${className}`}>
      <video
        poster={image?.url}
        src={video.url}
        className="w-full h-full object-cover rounded"
        autoPlay={playVideo}
        muted
        playsInline
        loop
        controls={showControls}
        onLoadedMetadata={handleLoadedMetadata}
        preload="none"
      />
    </div>
  );
};

export default VideoDisplay;
