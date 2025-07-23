import api from "@/app/lib/api";
import getDateString from "@/hooks/useDateString";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";

interface Article {
  _id: string;
  slug: string;
  title: string;
  createdAt: string;
  newsCategory: string;
}

const MostRead: FC = () => {
  const [mostReadArticles, setMostReadArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMostReadArticles = async () => {
      try {
        const response = await api.get<Article[]>("/most-read");
        setMostReadArticles(response.data);
      } catch (error) {
        console.error("Failed to fetch most read articles", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMostReadArticles();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      {mostReadArticles.length > 0 && (
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b-4 border-red-600 pb-2 w-32">
            Most read
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {mostReadArticles.map((article, index) => (
              <div
                key={article._id}
                className="flex flex-col justify-start mb-4"
              >
                <span className="text-red-600 text-xl font-bold">
                  {index + 1}
                </span>
                <Link
                  href={`/${getDateString(article.createdAt)}/${
                    article.newsCategory
                  }/${article.slug}`}
                  className="ml-4 text-base leading-tight text-black hover:text-red-600 transition-colors border-b"
                >
                  {article.title}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MostRead;
