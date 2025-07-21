"use client";

import Sidebar from "@/components/Sidebar";
import { useCheckAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [showNewsUploadModal, setShowNewsUploadModal] = useState(false);
  const router = useRouter();
  const { data, isLoading, isError } = useCheckAuth();
  // console.log("🚀 ~ Page ~ data:", data);

  const displayNewsUploadModal = () => {
    setShowNewsUploadModal(true);
  };

  const hideNewsUploadModal = () => {
    setShowNewsUploadModal(false);
  };

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.push("/login");
      return;
    }

    if (data?.user?.role !== "admin") {
      toast.error("You do not have permission to access this page.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      router.push("/");
    }
  }, [data, isLoading, isError, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex w-full">
        <Sidebar onAddNewsClick={displayNewsUploadModal} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <main></main>
        </div>
      </div>
    </div>
  );
};

export default Page;
