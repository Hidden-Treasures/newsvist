"use client";

import { useState, useEffect } from "react";
import VideoDisplay from "@/helper/VideoDisplay";
import FileDisplay from "@/helper/FileDisplay";
import Image from "next/image";
import Share from "@/common/Share";
import AuthorLink from "@/components/AuthorLink";
import Link from "next/link";
import RelatedNews from "@/home/RelatedNews";
import UpNext from "./cards/UpNextCard";
import MostRead from "./cards/MostRead";
import CommentList from "./comment/CommentList";

interface Media {
  url: string;
  public_id?: string;
  [key: string]: any;
}

interface User {
  profilePhoto?: string;
  username?: string;
}

interface Author {
  username?: string;
  profilePhoto?: string;
}

interface ArticleProps {
  article: {
    _id: string;
    title: string;
    editorText: string;
    file?: Media;
    video?: Media | null;
    user?: User;
    author?: string;
    editor?: Author;
    city?: string;
    tags?: string[] | { _id: string; name: string }[];
    newsCategory: string;
    createdAt: string;
  };
  slug: string;
}

export default function ArticleContent({ article, slug }: ArticleProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (article) setLoading(false);
  }, [article]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <p className="text-light-subtle animate-pulse">Loading...</p>
      </div>
    );
  }

  const cityText =
    article?.city && article.city !== "undefined"
      ? `${article.city} (Newsvist)`
      : "(Newsvist)";

  const wordsPerMinute = 200;
  const words = article.editorText?.split(" ")?.length || 0;
  const readingTime = Math.ceil(words / wordsPerMinute);

  const date = new Date(article?.createdAt ?? "");
  const formattedDate = !isNaN(date.getTime())
    ? date.toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    : "Invalid date";

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const hashTags = "#newsvistupdates";

  const articleTags = article?.tags?.map((tag: any) =>
    typeof tag === "string" ? tag : tag._id
  );

  return (
    <div>
      <h1 className="md:text-4xl text-2xl font-bold m-4 pb-4 capitalize">
        {article.title}
      </h1>

      <div className="author flex items-center mb-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={article.user?.profilePhoto ?? ""}
            alt="user"
            width={100}
            height={100}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-base text-gray-600 pl-2">
          By <AuthorLink author={article.author} />
          {article?.editor?.username && (
            <>
              {" "}
              | Editor: <AuthorLink author={article.editor.username} />
            </>
          )}
          , NEWSVIST
          <div className="flex items-center mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <span className="pl-2">
              {readingTime} minute read Published {formattedDate}
            </span>
          </div>
        </div>
      </div>

      <Share
        url={articleUrl}
        title={article.title}
        image={article.file?.url}
        hashtag={hashTags}
        description={article.editorText.slice(0, 160)}
      />

      <div className="content pt-6">
        <div className="image-box bg-gray-100">
          {article.video ? (
            <VideoDisplay image={article.file} video={article.video} />
          ) : (
            <FileDisplay file={article.file!} />
          )}
        </div>

        <p className="text-base leading-relaxed mt-4 mb-6">
          <span
            style={{ whiteSpace: "pre-line" }}
            className="[&>*]:m-0 [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer hover:[&_a]:text-blue-800"
            dangerouslySetInnerHTML={{
              __html: `<strong>${cityText} — </strong>${article.editorText.replace(
                /^<p>|<\/p>$/g,
                ""
              )}`,
            }}
          />
        </p>

        <div className="ml-2 md:ml-16 mr-2 md:mr-16 mt-4">
          <div className="flex flex-wrap mt-4">
            <h2 className="text-base font-bold mr-2">Tags: </h2>
            {article?.tags?.map((tag: any, index: number) => {
              const tagId = typeof tag === "string" ? tag : tag._id;
              const tagName = typeof tag === "string" ? tag : tag.name;
              return (
                <Link href={`/tag/${tagId}`} key={index}>
                  <span className="bg-blue-500 text-white text-xs px-3 py-1 mr-2 mb-2 rounded-full font-semibold">
                    {tagName}
                  </span>
                </Link>
              );
            })}
          </div>
          <Share
            url={articleUrl}
            title={article.title}
            image={article.file?.url}
            hashtag={hashTags}
            description={article.editorText.slice(0, 160)}
          />

          <RelatedNews
            slug={slug!}
            tags={articleTags!}
            category={article?.newsCategory}
          />
          <UpNext slug={slug} />
          <MostRead />

          <Share
            url={articleUrl}
            title={article.title}
            image={article.file?.url}
            hashtag={hashTags}
            description={article.editorText.slice(0, 160)}
          />
        </div>
        <CommentList articleId={article?._id} />
      </div>
    </div>
  );
}
