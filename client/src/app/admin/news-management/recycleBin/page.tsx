"use client";
import Pagination from "@/components/lists/Pagination";
import RecycleTable from "@/components/lists/RecycleTable";
import { useDeletedArticles } from "@/hooks/useNews";
import { News } from "@/services/types";
import React, { FC, useEffect, useState } from "react";

const RecycleBin: FC = () => {
  const itemsPerPage = 5;
  const [newsData, setNewsData] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const { data, isLoading, isError, refetch } = useDeletedArticles({
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
      <h1 className="text-3xl font-bold mb-4 text-white">Recycled Article</h1>
      <RecycleTable
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

export default RecycleBin;
