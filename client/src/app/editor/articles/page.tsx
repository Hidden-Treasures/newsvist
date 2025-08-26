"use client";

import React, { useEffect, useRef, useState } from "react";
import { News } from "@/services/types";
import NewsTable from "@/components/lists/NewsTable";
import Pagination from "@/components/lists/Pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEditorNewsList } from "@/hooks/useNews";
import RecycleBin from "@/components/RecycleBin";
import CreateNewsForm from "@/components/forms/CreateNews";
import { Select } from "@/components/ui/select";

const EditorArticleList = () => {
  const itemsPerPage = 10;
  const [newsData, setNewsData] = useState<News[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState("");

  const searchRef = useRef<HTMLInputElement | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openRecycle, setOpenRecycle] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [publishedFilter, setPublishedFilter] = useState<string | "all">("all");

  const { data, isLoading, isError, refetch } = useEditorNewsList({
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Articles</h1>

        {/* Search + Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder="Search articles…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-slate-800/60 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
          <Button onClick={() => setOpenCreate(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create
          </Button>
          <Button
            variant="destructive"
            size="icon"
            title="Recycle Bin"
            onClick={() => setOpenRecycle(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 p-1 rounded"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="scheduled">Scheduled</option>
        </Select>

        <Select
          value={publishedFilter}
          onChange={(e) => setPublishedFilter(e.target.value)}
          className="bg-slate-800 text-white border border-slate-700 p-1 rounded"
        >
          <option value="all">All</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </Select>
      </div>
      {/* Table */}
      <NewsTable
        data={newsData
          .filter((n) =>
            n.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter((n) =>
            statusFilter === "all" ? true : n.status === statusFilter
          )
          .filter((n) =>
            publishedFilter === "all"
              ? true
              : n.published.toString() === publishedFilter
          )}
        afterDelete={handleUIUpdate}
        afterUpdate={handleUIUpdate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination pageCount={totalPages} onPageChange={handlePageChange} />
      </div>

      {/* Create News Dialog */}
      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-5 md:p-8 shadow-lg flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-2 sticky top-0 bg-slate-950 z-10">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">
              Create a News Article
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-gray-400">
              Fill the form below and submit to publish or save as draft.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 mt-4">
            <CreateNewsForm />
          </div>
        </DialogContent>
      </Dialog>
      {/* Recycle Bin Dialog */}
      <Dialog open={openRecycle} onOpenChange={setOpenRecycle}>
        <DialogContent className="w-full max-w-[95vw] md:max-w-5xl lg:max-w-6xl h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
          <DialogHeader className="flex flex-col gap-2 sticky top-0 bg-slate-950 z-10">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white">
              Recycle Bin
            </DialogTitle>
            <DialogDescription className="text-sm md:text-base text-gray-400">
              Manage deleted articles. You can restore or permanently remove
              them.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 mt-4">
            <RecycleBin />
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default EditorArticleList;
