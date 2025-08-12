"use client";

import React, { FC, useEffect, useState } from "react";
import NewsTable from "@/components/lists/NewsTable";
import { useNewsList } from "@/hooks/useNews";
import { News } from "@/services/types";
import Pagination from "@/components/lists/Pagination";

const NewsList: FC = () => {
  const itemsPerPage = 5;
  const [newsData, setNewsData] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const { data, isLoading, isError, refetch } = useNewsList({
    currentPage,
    itemsPerPage,
  });

  useEffect(() => {
    if (data) {
      setNewsData(data.news || []);
      setTotalPages(data.totalPages || 0);
    }
  }, [data]);

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleUIUpdate = () => {
    refetch();
  };

  return (
    <div className="mt-12 mx-4">
      <h1 className="text-3xl font-bold mb-4 text-white">Articles</h1>
      <NewsTable
        data={newsData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        afterDelete={handleUIUpdate}
        afterUpdate={handleUIUpdate}
      />
      <Pagination pageCount={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default NewsList;
