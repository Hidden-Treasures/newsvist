"use client";

import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { Trash2 } from "react-feather";
import ConfirmModal from "../modals/confirmModal";
import NewsUpdate from "../NewsUpdate";
import { News, NewsTableProps } from "@/services/types";
import { useAddToRecycleBin } from "@/hooks/useNews";

const NewsTable: FC<NewsTableProps> = ({ data, afterDelete, afterUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState<string | null>(null);

  const { mutate: addToRecycle, isPending } = useAddToRecycleBin();

  const router = useRouter();

  const filteredData = data.filter(
    (item) =>
      item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData;

  const displayConfirmModal = (id: string) => {
    setDeletedItemId(id);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    if (!deletedItemId) return;
    addToRecycle(deletedItemId, {
      onSuccess: () => {
        hideConfirmModal();
        toast.success("Moved to recycle bin!");
        afterDelete(data);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to move to recycle bin");
      },
    });
  };

  const handleCreateNews = () => {
    router.push("/admin/news-management/create");
  };

  const handleRecycleBin = () => {
    router.push("/admin/news-management/recycleBin");
  };

  const formatDate = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOnEditClick = (id: string) => {
    setShowUpdateModal(true);
    setSelectedNewsId(id);
  };

  const handleOnUpdate = (news?: News) => {
    afterUpdate(news);
    setShowUpdateModal(false);
    setSelectedNewsId(null);
  };

  const hideConfirmModal = () => setShowConfirmModal(false);
  const hideUpdateModal = () => setShowUpdateModal(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="md:flex w-full">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search news..."
              className="border p-2 placeholder:text-gray-400 border-blue-400 rounded-b-lg dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex md:justify-end">
            <button
              onClick={handleCreateNews}
              className="bg-blue-500 text-white mb-4 py-2 px-4 mx-2 rounded hover:bg-blue-600"
            >
              Create News
            </button>
            <button
              onClick={handleRecycleBin}
              className="bg-red-500 text-white mb-4 py-1 px-2 rounded hover:bg-red-600"
              title="Recycle Bin"
            >
              <Trash2 />
            </button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Title
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Category
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Author
              </th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">
                Published Date
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50 transition-colors even:bg-gray-50"
              >
                <td className="py-3 px-4">{item.title}</td>
                <td className="py-3 px-4">{item.newsCategory}</td>
                <td className="py-3 px-4">{item.authorName}</td>
                <td className="py-3 px-4">{formatDate(item.createdAt)}</td>
                <td className="py-3 px-4 flex justify-center space-x-4">
                  <button
                    onClick={() => handleOnEditClick(item._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => displayConfirmModal(item._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition"
                    title="Trash"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure?"
        subtitle="This action will add this article to the recycle bin!"
        busy={isPending}
      />
      <NewsUpdate
        newsId={selectedNewsId}
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        onSuccess={handleOnUpdate}
      />
    </>
  );
};

export default NewsTable;
