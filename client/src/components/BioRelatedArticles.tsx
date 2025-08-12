"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useArticlesByBiography } from "@/hooks/useBiography";
import getDateString from "@/hooks/useDateString";
import TruncateText from "@/helper/helper";
import Image from "next/image";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function BioRelatedArticle({
  realName,
  stageName,
}: {
  realName?: string;
  stageName?: string;
}) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const person = stageName || realName || "";

  const { data, isLoading } = useArticlesByBiography(person, page);

  useEffect(() => {
    if (data?.totalPages) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  if (isLoading) {
    return <p className="p-4">Loading related articles...</p>;
  }

  if (!data?.articles?.length) {
    return null;
  }

  return (
    <motion.section
      className="bg-gray-50 py-10 px-6 md:px-16"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="w-full px-6 py-8 md:px-16">
        <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2">
          <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
            {stageName || realName}
          </span>
          <span className="text-gray-700">Articles</span>
        </h2>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
          {data?.articles?.map((article: any, index: number) => (
            <Link
              key={index}
              href={`/${getDateString(article?.createdAt)}/${
                article?.newsCategory
              }/${article?.slug}`}
            >
              <div className="flex items-start space-x-4 border-b pb-4">
                <Image
                  src={article?.file?.url}
                  alt={article?.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h3 className="font-bold md:text-lg text-sm hover:text-red-500">
                    {TruncateText(article?.title, 8)}
                  </h3>
                  <Link
                    href={`/biography/${(stageName || realName || "")
                      .replace(/\s+/g, "")
                      .toLowerCase()}`}
                    className="text-gray-400 font-bold hover:text-red-500"
                  >
                    {stageName || realName}
                  </Link>

                  <p className="text-gray-400 text-sm mt-1">
                    {new Date(article?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-3 mt-6">
          {/* Previous Button */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
               hover:bg-gray-100 shadow-sm transition-all duration-200 
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Page Info */}
          <span className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
            Page <span className="font-semibold text-yellow-600">{page}</span>{" "}
            of <span className="font-semibold">{totalPages}</span>
          </span>

          {/* Next Button */}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 
               hover:bg-gray-100 shadow-sm transition-all duration-200 
               disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </motion.section>
  );
}
