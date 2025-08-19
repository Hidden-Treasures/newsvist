"use client";

import React, { useEffect, useState } from "react";
// import { getNewsForUpdate, updateNews } from "../../Api/createNews";
import { toast } from "react-toastify";
import ModalContainer from "./modals/Container";
import NewsForm from "./forms/News";
import { useGetNewsForUpdate, useUpdateNews } from "@/hooks/useNews";
import { News } from "@/services/types";
import NewsOrLiveUpdate from "./forms/NewsOrLiveUpdate";

interface NewsUpdateProps {
  newsId: string | null;
  visible: boolean;
  onSuccess: (news: News) => void;
  onClose: () => void;
}

export default function NewsUpdate({
  newsId,
  visible,
  onSuccess,
  onClose,
}: NewsUpdateProps) {
  const { data, isLoading, isSuccess, error } = useGetNewsForUpdate(newsId);

  const { mutate: updateNewsMutation, isPending: isUpdating } = useUpdateNews();

  useEffect(() => {
    if (error) toast.error(error.message);
  }, [error]);

  const handleSubmit = (formData: FormData, reset: () => void) => {
    if (isUpdating || !newsId) return;

    updateNewsMutation(
      { id: newsId, newsData: formData },
      {
        onSuccess: (res: any) => {
          toast.success(res?.message || "News updated successfully");
          onSuccess(res?.news);
          reset();
        },
        onError: (err: any) => {
          toast.error(err.message || "Failed to update news");
        },
      }
    );
  };

  return (
    <ModalContainer visible={visible} onClose={onClose}>
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <p className="text-light-subtle !bg-transparent animate-pulse text-xl">
            Please wait...
          </p>
        </div>
      ) : isSuccess && data?.news ? (
        <NewsOrLiveUpdate
          initialState={data.news}
          btnTitle="Update"
          onSubmit={handleSubmit}
          busy={isUpdating}
        />
      ) : (
        <p className="text-center text-light-subtle text-lg">
          News item not found.
        </p>
      )}
    </ModalContainer>
  );
}
