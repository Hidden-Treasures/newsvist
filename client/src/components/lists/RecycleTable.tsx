import { useDeleteArticle, useRestoreArticle } from "@/hooks/useNews";
import { NewsTableProps } from "@/services/types";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../modals/confirmModal";
import { formatDate } from "@/helper/helper";

const RecycleTable: FC<NewsTableProps> = ({
  data,
  afterDelete,
  afterUpdate,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState<string | null>(null);
  const { mutate: deleteArticle, isPending: deleting } = useDeleteArticle();
  const { mutate: restoreArticle, isPending: restoring } = useRestoreArticle();

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
    deleteArticle(deletedItemId, {
      onSuccess: () => {
        hideConfirmModal();
        toast.success("Article Permanently deleted!");
        afterDelete(data);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete article");
      },
    });
  };
  const handleRestoreArticle = (id: string) => {
    restoreArticle(id, {
      onSuccess: () => {
        toast.success("Article restored successfully!");
        afterUpdate();
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to restore article");
      },
    });
  };

  const hideConfirmModal = () => setShowConfirmModal(false);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search news..."
            className="border p-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
                Delete Date
              </th>
              <th className="py-3 px-4 text-center font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData?.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-blue-50 transition-colors even:bg-gray-50"
              >
                <td className="py-3 px-4">{item?.title}</td>
                <td className="py-3 px-4">{item?.newsCategory}</td>
                <td className="py-3 px-4">{item?.authorName}</td>
                <td className="py-3 px-4">{formatDate(item?.deletedAt)}</td>
                <td className="py-3 px-4 flex justify-center space-x-4">
                  <button
                    onClick={() => handleRestoreArticle(item._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 12h-15"
                      />
                    </svg>
                    <span>Restore</span>
                  </button>
                  <button
                    onClick={() => displayConfirmModal(item?._id)}
                    className="flex items-center space-x-1 px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9
                     m9.968-3.21c.342.052.682.107 1.022.166
                     m-1.022-.165L18.16 19.673a2.25 2.25 0 0
                     1-2.244 2.077H8.084a2.25 2.25 0 0
                     1-2.244-2.077L4.772 5.79
                     m14.456 0a48.108 48.108 0 0
                     0-3.478-.397m-12 .562c.34-.059.68-.114
                     1.022-.165m0 0a48.11 48.11 0 0
                     1 3.478-.397m7.5 0v-.916
                     c0-1.18-.91-2.164-2.09-2.201
                     a51.964 51.964 0 0 0-3.32 0
                     c-1.18.037-2.09 1.022-2.09
                     2.201v.916m7.5 0a48.667 48.667
                     0 0 0-7.5 0"
                      />
                    </svg>
                    <span>Trash</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-0">
        <ConfirmModal
          visible={showConfirmModal}
          onConfirm={handleOnDeleteConfirm}
          onCancel={hideConfirmModal}
          title="Are you sure?"
          subtitle="This action will remove this news permanently!"
          busy={deleting}
        />
      </div>
    </>
  );
};

export default RecycleTable;
