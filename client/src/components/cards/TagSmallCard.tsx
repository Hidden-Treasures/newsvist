import FileDisplay from "@/helper/FileDisplay";
import TruncateText from "@/helper/helper";
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

interface TagSmallCardProps {
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

const TagSmallCard: FC<TagSmallCardProps> = ({
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
    <div
      className={`${horizontal ? "p-2" : ""} ${
        color ? "bg-black" : ""
      } ${className} mt-2 pt-4`}
    >
      {/* <div className="relative w-305 h-171 group"> */}
      <div className="relative group border-b border-b-[#e6e6e6] mb-3 pb-3 flex max-w-full">
        {imageSrc ? (
          video ? (
            <div
              className={
                "relative object-cover bg-fixed opacity-100 transition duration-300 ease-in-out hover:opacity-50"
              }
            >
              <VideoDisplay
                image={normalizedImage}
                video={normalizedVideo}
                className="w-full object-cover transition-transform transform rounded-lg group-hover:scale-100"
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
            <div
              className={
                "object-cover bg-fixed opacity-100 transition duration-300 ease-in-out hover:opacity-50"
              }
            >
              <FileDisplay
                file={{
                  url: normalizedImage?.url!,
                  isVideo: !!video,
                  duration: videoDuration ?? "",
                }}
                className="w-full h-full object-cover transition-transform rounded-lg transform group-hover:scale-100"
              />
            </div>
          )
        ) : (
          <div
            className={
              "object-cover bg-fixed opacity-100 transition duration-300 ease-in-out hover:opacity-50"
            }
          >
            <Image
              src={normalizedImage?.url || ""}
              alt={normalizedImage?.public_id || "image"}
              className="w-full h-full object-cover transition-transform rounded-lg transform group-hover:scale-100"
              width={800}
              height={600}
              unoptimized={true}
            />
          </div>
        )}
      </div>

      <div className="w-3/5 ml-2">
        <h4
          className={`text-base self-start ml-2 hover:underline hover:text-gray-700`}
        >
          {loading ? (
            <TextLoader className="mx-auto text-center !bg-transparent" />
          ) : (
            <>{text ? TruncateText(text, 8) : null}</>
          )}
        </h4>
      </div>
    </div>
  );

  return link ? <Link href={link}>{content}</Link> : content;
};

export default TagSmallCard;
