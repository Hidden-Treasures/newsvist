"use client";

import LoadingSpinner from "@/helper/LoadingSpinner";
import { useNewsByTag } from "@/hooks/useNews";
import { useSearchParams } from "next/navigation";
import React from "react";
import MidCard from "./cards/MidCard";
import getDateString from "@/hooks/useDateString";

const TagClient = ({ tag }: { tag: string }) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  const { data, isLoading, isError } = useNewsByTag(tag, page);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <p>Something went wrong loading news for tag: {tag}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold capitalize mb-4">#{tag} News</h1>
      {data?.news?.length ? (
        <div className="grid gap-4">
          {data?.news?.map((item: any, index: number) => (
            <MidCard
              key={`tag-grid-${index}`}
              link={`/${getDateString(item.createdAt)}/${item.newsCategory}/${
                item.slug
              }`}
              imageSrc={item.file}
              text={item.title}
              tags={item.tags}
              db={true}
              fileClass={"w-full"}
            />
          ))}
        </div>
      ) : (
        <p>No news found for this tag.</p>
      )}
    </div>
  );
};

export default TagClient;
