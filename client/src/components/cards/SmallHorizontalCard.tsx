import FileDisplay from "@/helper/FileDisplay";
import TextLoader from "@/helper/TextLoader";
import VideoDisplay from "@/helper/VideoDisplay";
import Image from "next/image";
import Link from "next/link";
import React, { FC, SyntheticEvent, useState } from "react";
import { Video } from "react-feather";

interface MediaFile {
  url: string;
  public_id: string;
  [key: string]: any;
}

interface SmallHorizontalCardProps {
  link?: string;
  imageSrc?: string | MediaFile;
  tags?: string[];
  bioName?: string;
  bioId?: string;
  text?: string;
  horizontal?: boolean;
  color?: boolean;
  loading?: boolean;
  db?: boolean;
  video?: string | MediaFile | null;
  className?: string;
}

const SmallHorizontalCard: FC<SmallHorizontalCardProps> = ({
  link,
  imageSrc,
  tags,
  bioName,
  text,
  horizontal = false,
  color = false,
  loading = false,
  db = false,
  video,
  className = "",
  bioId,
}) => {
  const [videoDuration, setVideoDuration] = useState<string | null>(null);

  const handleLoadedMetadata = (e: SyntheticEvent<HTMLVideoElement>) => {
    const duration = e.currentTarget.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    setVideoDuration(`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`);
  };

  const normalizeMediaFile = (
    media: string | MediaFile | undefined | null
  ): MediaFile | undefined => {
    if (!media) return undefined;
    return typeof media === "string" ? { url: media, public_id: media } : media;
  };

  const normalizedImage = normalizeMediaFile(imageSrc);
  const normalizedVideo = normalizeMediaFile(video);

  const content = (
    <div className={`flex mt-2 border-t pt-4`}>
      {/* <div className="relative w-305 h-171 group"> */}
      <div className="relative group w-1/4 h-20">
        {imageSrc ? (
          video ? (
            <div className={"relative " + className}>
              <VideoDisplay
                image={normalizedImage}
                video={normalizedVideo}
                className="w-full h-full object-cover transition-transform transform group-hover:scale-100"
                handleLoadedMetadata={handleLoadedMetadata}
                showControls={false}
              />
              {videoDuration && (
                <div className="absolute bottom-0 right-0 flex items-center bg-black bg-opacity-50 py-1 px-2">
                  <Video className="mr-1 text-white" size={11} />
                  <span className="text-white font-bold text-xs">
                    {videoDuration}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <FileDisplay
              file={{
                url: normalizedImage?.url || "",
                isVideo: !!video,
                duration: videoDuration ?? "",
              }}
              className="w-full h-full object-cover transition-transform transform group-hover:scale-100"
            />
          )
        ) : (
          <div className={className}>
            <Image
              src={normalizedImage?.url || ""}
              alt={normalizedImage?.public_id || "image"}
              className="w-full h-full object-cover transition-transform transform group-hover:scale-100"
              width={800}
              height={600}
              unoptimized={true}
            />
          </div>
        )}
      </div>

      <h4
        className={`text-base self-start ml-2 hover:underline hover:text-gray-700 w-3/4`}
      >
        {loading ? (
          <TextLoader className="mx-auto text-center !bg-transparent" />
        ) : (
          text
        )}
      </h4>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
};

export default SmallHorizontalCard;
