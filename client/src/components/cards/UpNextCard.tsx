import FileDisplay from "@/helper/FileDisplay";
import VideoDisplay from "@/helper/VideoDisplay";
import getDateString from "@/hooks/useDateString";
import { useUpNextArticle } from "@/hooks/useNews";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { Video } from "react-feather";
import { MediaFile } from "./MidCard";

interface Media {
  url: string;
  public_id: string;
  [key: string]: any;
}

interface ArticleType {
  _id: string;
  title: string;
  slug: string;
  createdAt: string;
  newsCategory: string;
  file?: Media;
  video?: Media;
}

interface UpNextProps {
  slug: string;
}

const UpNext: FC<UpNextProps> = ({ slug }) => {
  const [videoDuration, setVideoDuration] = useState<string | null>(null);

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
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

  const { data } = useUpNextArticle(slug);

  const upNextArticles: ArticleType[] = data?.relatedNews || [];

  return (
    <>
      {upNextArticles.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 border-b-4 border-red-600 w-24">
            Up next
          </h2>
          <ul>
            {upNextArticles?.map((article: ArticleType, index: number) => {
              console.log("🚀 ~ {upNextArticles?.map ~ article:", article);
              const normalizedImage = normalizeMediaFile(article?.file);
              const normalizedVideo = normalizeMediaFile(article?.video);
              return (
                <li key={index} className="flex items-start mb-6">
                  <div className="flex-1">
                    <Link
                      href={`/${getDateString(article.createdAt)}/${
                        article.newsCategory
                      }/${article.slug}`}
                      className="font-semibold md:text-lg text-base hover:underline flex flex-wrap w-11/12"
                    >
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {Math.floor(Math.random() * 12) + 1} minute read
                    </p>
                  </div>

                  <div className="md:w-1/5 md:ml-0 ml-2">
                    {article.file ? (
                      article.video ? (
                        <div className="relative object-cover bg-fixed opacity-100 transition duration-300 ease-in-out hover:opacity-50">
                          <VideoDisplay
                            image={article.file}
                            video={article.video}
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
                        <div className="object-cover bg-fixed opacity-100 transition duration-300 ease-in-out hover:opacity-50">
                          <FileDisplay
                            file={{
                              ...article.file,
                              isVideo: !!article.video,
                              duration: videoDuration ?? "",
                            }}
                            className="w-40 h-20 object-cover transition-transform transform group-hover:scale-100"
                          />
                        </div>
                      )
                    ) : (
                      <div className="object-cover bg-fixed opacity-100 transition duration-300 ease-in-out hover:opacity-50">
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
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
};

export default UpNext;
