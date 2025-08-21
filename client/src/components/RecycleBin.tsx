"use client";
import Pagination from "@/components/lists/Pagination";
import RecycleTable from "@/components/lists/RecycleTable";
import { useDeletedArticles } from "@/hooks/useNews";
import { News } from "@/services/types";
import { Search } from "lucide-react";
import React, { FC, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";

const RecycleBin: FC = () => {
  const itemsPerPage = 5;
  const [newsData, setNewsData] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef<HTMLInputElement | null>(null);

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
    <main className="space-y-6 mt-6 mx-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Recycled Article</h1>

        {/* Search + Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder="Search deleted articles…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
      <RecycleTable
        data={newsData.filter((n) =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        afterDelete={handleUIUpdate}
        afterUpdate={handleUIUpdate}
      />
      <div className="flex justify-center">
        <Pagination pageCount={totalPages} onPageChange={handlePageChange} />
      </div>
    </main>
  );
};

export default RecycleBin;
