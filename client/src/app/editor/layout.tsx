"use client";

import Header from "@/components/Header";
import MobileSidebar from "@/components/MobileSidebar";
import Sidebar from "@/components/Sidebar";

import { useAuth } from "@/context/AuthContext";
import { useCheckAuth } from "@/hooks/useAuth";
import { BarChart3, ImageIcon, Newspaper, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateNewsForm from "@/components/forms/CreateNews";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isError } = useCheckAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const nav = useMemo(
    () => [
      { label: "Overview", href: "/editor/dashboard", icon: BarChart3 },
      {
        label: "Articles",
        href: "/editor/articles",
        icon: Newspaper,
      },
      { label: "Media", href: "/editor/media", icon: ImageIcon },

      {
        label: "Biography",
        href: "/editor/profile-management/biography",
        icon: User,
      },
    ],
    []
  );

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.push("/login");
      return;
    }

    if (data?.user?.role !== "editor") {
      toast.error("You do not have permission to access this page.");
      router.push("/");
    }
  }, [data, isLoading, isError, router]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/") searchRef.current?.focus();
      if ((e.key === "a" || e.key === "A") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setOpenCreate(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold animate-pulse">Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-100">
      {/* Header / Topbar */}
      <Header user={user} searchRef={searchRef} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 py-6">
        {/* Sidebar (desktop) */}
        <Sidebar
          nav={nav}
          openCreate={openCreate}
          setOpenCreate={setOpenCreate}
        />

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 w-full  mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile sidebar */}
      <MobileSidebar
        open={mobileOpen}
        setOpen={setMobileOpen}
        nav={nav}
        setOpenCreate={setOpenCreate}
      />

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent
          className="w-full max-w-[95vw] md:max-w-4xl lg:max-w-6xl h-[90vh] md:h-auto md:max-h-[85vh] overflow-y-auto hide-scrollbar bg-slate-950 border border-slate-800 rounded-xl p-5 md:p-8 shadow-lg flex flex-col gap-4
    "
        >
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
    </div>
  );
}
