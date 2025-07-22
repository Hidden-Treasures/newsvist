"use client";

import Header from "@/components/Header";
import NewsUpload from "@/components/NewsUpload";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useCheckAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [showNewsUploadModal, setShowNewsUploadModal] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isError } = useCheckAuth();

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
        <p className="text-xl font-semibold animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar onAddNewsClick={displayNewsUploadModal} />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-scroll hide-scrollbar">
        <Header profileImage={user?.profilePhoto!} />
        <main className="dark:!bg-[#182235] px-4 sm:px-6 lg:px-8 py-8 w-full h-screen max-w-9xl mx-auto overflow-auto scrollbar overflow-y-scroll hide-scrollbar">
          {children}
        </main>
      </div>
      <NewsUpload visible={showNewsUploadModal} onClose={hideNewsUploadModal} />
    </div>
  );
}
