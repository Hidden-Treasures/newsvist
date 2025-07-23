import TagSmallCard from "@/components/cards/TagSmallCard";
import getDateString from "@/hooks/useDateString";
import { useNewsAndBuzz } from "@/hooks/useNews";
import React from "react";

interface NewsArticle {
  createdAt: string | Date;
  newsCategory: string;
  slug: string;
  file?: string;
  title: string;
  video?: string;
}

const NewsAndBuzz = () => {
  const {
    data: newsAndBuzzArticles = [],
    isLoading,
    refetch,
  } = useNewsAndBuzz();

  return (
    <div className="mt-8">
      <div className="">
        {newsAndBuzzArticles?.map((article: NewsArticle, index: number) => (
          <TagSmallCard
            key={index}
            link={`/${getDateString(article?.createdAt)}/${
              article?.newsCategory
            }/${article?.slug}`}
            imageSrc={article?.file}
            text={article?.title}
            video={article?.video}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsAndBuzz;
