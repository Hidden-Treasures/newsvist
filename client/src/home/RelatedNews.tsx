"use client";

import RelatedCard from "@/components/cards/RelatedCard";
import getDateString from "@/hooks/useDateString";
import { useRelatedNews } from "@/hooks/useNews";
import { GetRelatedNewsParams } from "@/services/types";
import React, { FC } from "react";

interface RelatedNewsProps extends GetRelatedNewsParams {
  slug: string;
  tags: string[];
  category: string;
}

const RelatedNews: FC<RelatedNewsProps> = ({ slug, tags, category }) => {
  const {
    data: relatedArticles,
    loading,
    error,
  } = useRelatedNews({
    slug,
    tags,
    category,
  });

  if (loading) {
    return <div className="mt-8">Loading related articles...</div>;
  }

  if (error) {
    return <div className="mt-8 text-red-500">Error: {error}</div>;
  }

  if (!relatedArticles?.length) {
    return null;
  }
  return (
    <>
      {relatedArticles && relatedArticles?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
          <div className="grid md:grid-cols-5 grid-cols-2 gap-4">
            {relatedArticles?.map((article, index) => (
              <RelatedCard
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
      )}
    </>
  );
};

export default RelatedNews;
