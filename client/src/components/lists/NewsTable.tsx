"use client";

import React, { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmModal from "../modals/confirmModal";
import NewsUpdate from "../NewsUpdate";
import { News, NewsTableProps } from "@/services/types";
import { useAddToRecycleBin } from "@/hooks/useNews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NewsTable: FC<NewsTableProps> = ({ data, afterDelete, afterUpdate }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deletedItemId, setDeletedItemId] = useState<string | null>(null);

  const { mutate: addToRecycle, isPending } = useAddToRecycleBin();
  const router = useRouter();

  const formatDate = (dateTimeString: string): string => {
    return new Date(dateTimeString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
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

  const displayConfirmModal = (id: string) => {
    setDeletedItemId(id);
    setShowConfirmModal(true);
  };

  const handleOnDeleteConfirm = async () => {
    if (!deletedItemId) return;
    addToRecycle(deletedItemId, {
      onSuccess: () => {
        toast.success("Moved to recycle bin!");
        setShowConfirmModal(false);
        afterDelete(data);
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to move to recycle bin");
      },
    });
  };

  return (
    <>
      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">News List</CardTitle>
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
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item) => (
                  <TableRow key={item._id} className="hover:bg-slate-800/40">
                    <TableCell className="font-medium truncate max-w-[220px]">
                      {item.title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="rounded-full">
                        {item.newsCategory}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {typeof item.author === "object" && item.author?.username
                        ? item.author.username
                        : typeof item.editor === "object" &&
                          item.editor?.username
                        ? item.editor.username
                        : "—"}
                    </TableCell>

                    <TableCell className="text-slate-400 flex flex-col gap-1">
                      <Badge
                        variant={item.published ? "secondary" : "destructive"}
                        className="rounded-full"
                      >
                        {item.published ? "Published" : "Unpublished"}
                      </Badge>
                      <span className="text-xs">
                        {formatDate(item.publishedAt || item.createdAt)}
                      </span>
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleOnEditClick(item._id)}
                        className="text-gray-400"
                      >
                        <Pencil className="w-4 h-4" />
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

      {/* Modals */}
      <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={() => setShowConfirmModal(false)}
        title="Are you sure?"
        subtitle="This action will move the article to the recycle bin."
        busy={isPending}
      />
      <NewsUpdate
        newsId={selectedNewsId}
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSuccess={handleOnUpdate}
      />
    </>
  );
};

export default NewsTable;
