import { useDeleteArticle, useRestoreArticle } from "@/hooks/useNews";
import { NewsTableProps } from "@/services/types";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import ConfirmModal from "../modals/confirmModal";
import { formatDate } from "@/helper/helper";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { FaTrashRestore } from "react-icons/fa";

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
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recycle Bin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Author</TableHead>
                  <TableHead>Delete Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData?.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-800/40">
                    <TableCell className="font-medium truncate max-w-[220px] text-white">
                      {item.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="rounded-full">
                        {item.newsCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-white">
                      {typeof item.author === "object"
                        ? item.author?.username
                        : "—"}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {formatDate(item.deletedAt)}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRestoreArticle(item._id)}
                        className="text-gray-400"
                      >
                        <FaTrashRestore className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => displayConfirmModal(item._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure?"
        subtitle="This action will remove this news permanently!"
        busy={deleting}
      />
    </>
  );
};

export default RecycleTable;
