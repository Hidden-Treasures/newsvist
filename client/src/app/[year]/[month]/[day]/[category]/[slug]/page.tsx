"use client";

import { useParams, useRouter } from "next/navigation";
import { FC } from "react";
import { format } from "date-fns";
import Link from "next/link";
import NewsAndBuzz from "@/home/NewsAndBuzz";
import ColumnHead from "@/common/ColumnHead";
import TagSmallCard from "@/components/cards/TagSmallCard";
import getDateString from "@/hooks/useDateString";
import MostRead from "@/components/cards/MostRead";
import VideoDisplay from "@/helper/VideoDisplay";
import FileDisplay from "@/helper/FileDisplay";
import Image from "next/image";
import { useArticleBySlug } from "@/hooks/useNews";
import RelatedNews from "@/home/RelatedNews";
import UpNext from "@/components/cards/UpNextCard";
import Share from "@/common/Share";
import MetaTags from "@/common/MetaTags";
import CommentList from "@/components/comment/CommentList";
import { useProfileStore } from "@/store/profileStore";

interface Tag {
  _id: string;
  name: string;
}

interface Media {
  url: string;
  public_id: string;
  [key: string]: any;
}

interface Author {
  username?: string;
  profilePhoto?: string;
}

interface User {
  profilePhoto?: string;
  username?: string;
  [key: string]: any;
}

interface ArticleType {
  _id: string;
  title: string;
  slug: string;
  editorText: string;
  createdAt: string;
  file?: Media;
  video?: Media | null;
  user?: User;
  authorName?: string;
  editor?: Author;
  city?: string;
  tags?: Tag[] | string[];
  newsCategory: string;
}

const PostDetailsPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const setProfileUser = useProfileStore((state) => state.setProfileUser);
  const { data, isLoading, isError, error } = useArticleBySlug(slug!);

  const article = data?.article;
  const articleId = article?._id;
  const relatedNews = data?.relatedNews || [];

  const articleTags = article?.tags?.map((tag: any) =>
    typeof tag === "string" ? tag : tag._id
  );
  const articleCategory = article?.newsCategory;

  const wordsPerMinute = 200;
  const words = article?.editorText?.split(" ")?.length || 0;
  const readingTime = Math.ceil(words / wordsPerMinute);

  const date = new Date(article?.createdAt ?? "");
  const isValidDate = !isNaN(date.getTime());

  const formattedDate = isValidDate
    ? format(date, "h:mm a 'EST,' EEEE MMMM d, yyyy")
    : "Invalid date";

  const stripHtmlTags = (html?: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  };

  const articleTitle = article?.title ?? "";
  const articleDescription = `${stripHtmlTags(article?.editorText).substring(
    0,
    160
  )}... read more`;

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";
  const articleImage = article?.file?.url ?? "";

  const quote = articleTitle;
  const hashTags = "#newsvistupdates";

  const cityText =
    article?.city && article.city !== "undefined"
      ? `${article.city} (Newsvist)`
      : "(Newsvist)";

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <p className="text-light-subtle animate-pulse !bg-transparent">
          Please wait
        </p>
      </div>
    );
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  {
    article && (
      <MetaTags
        title={article?.title}
        description={articleDescription}
        url={articleUrl}
        image={article?.file?.url}
      />
    );
  }

  const handleAuthorClick = () => {
    setProfileUser(article.user || article.editor || {});
    router.push(`/profiles/${article?.authorName}`);
  };

  return (
    <div className="flex flex-wrap">
      <div className="w-full md:w-3/4 p-4">
        <h1 className="md:text-4xl text-2xl font-bold m-4 pb-4 capitalize">
          {article?.title}
        </h1>

        <div className="author flex">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image
              src={article?.user?.profilePhoto}
              alt="user"
              width={100}
              height={100}
              className="object cover w-full h-full"
            />
          </div>
          <div className="author-name-date">
            <div className="text-base text-gray-600 pl-2">
              By{" "}
              <span
                className="underline cursor-pointer"
                onClick={handleAuthorClick}
              >
                {article?.authorName}
              </span>
              {article?.editor?.username && (
                <>
                  | Editor:{" "}
                  <span
                    className="underline cursor-pointer"
                    onClick={handleAuthorClick}
                  >
                    {article.editor.username}
                  </span>
                </>
              )}
              , NEWSVIST
            </div>
            <div className="text-base text-gray-600 pl-2 flex items-center justify-center">
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
          title={articleTitle}
          image={articleImage}
          hashtag={hashTags}
          description={articleDescription}
        />

        <div className="content pt-6">
          <div className="image-box bg-gray-100">
            {article?.video ? (
              <VideoDisplay image={article.file} video={article.video} />
            ) : (
              <FileDisplay file={article?.file} />
            )}
          </div>

          <p className="text-base leading-relaxed mt-4 mb-6">
            <span className="font-bold">{cityText} — </span>
            <span
              className="[&>*]:inline [&>*]:m-0"
              dangerouslySetInnerHTML={{ __html: article?.editorText }}
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
              title={articleTitle}
              image={articleImage}
              hashtag={hashTags}
              description={articleDescription}
            />

            <RelatedNews
              slug={slug!}
              tags={articleTags}
              category={articleCategory}
            />
            <UpNext slug={slug} />
            <MostRead />
          </div>

          <Share
            url={articleUrl}
            title={articleTitle}
            image={articleImage}
            hashtag={hashTags}
            description={articleDescription}
          />
          <CommentList articleId={articleId!} />
          {/* <ThirdAdv /> */}
        </div>
      </div>

      <div className="w-full md:w-1/4 p-4 pr-2">
        {relatedNews && relatedNews?.length > 0 && (
          <div className="mt-12 md:mt-[12.5rem]">
            <ColumnHead columnHeadTag="MORE FROM NEWSVIST" />
          </div>
        )}

        <div>
          {relatedNews &&
            relatedNews?.map((newsItem: ArticleType, index: number) => (
              <TagSmallCard
                key={index}
                link={`/${getDateString(newsItem?.createdAt)}/${
                  newsItem?.newsCategory
                }/${newsItem?.slug}`}
                imageSrc={newsItem?.file}
                text={newsItem?.title}
                video={newsItem?.video}
              />
            ))}
        </div>

        <div className="mt-12 md:mt-[12.5rem]">
          <ColumnHead columnHeadTag="NEWS & BUZZ" />
        </div>

        <NewsAndBuzz />

        <div className="mt-5">
          <Link href="/adv-link">
            <div className="w-full h-64 group mb-4">{/* <SquareAd /> */}</div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetailsPage;
