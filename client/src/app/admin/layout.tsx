"use client";

import Header from "@/components/Header";
import MobileSidebar from "@/components/MobileSidebar";
import NewsUpload from "@/components/NewsUpload";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { useCheckAuth } from "@/hooks/useAuth";
import {
  BarChart3,
  BookOpen,
  Flag,
  ImageIcon,
  Newspaper,
  Settings,
  Shapes,
  User,
  Users,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isError } = useCheckAuth();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const nav = useMemo(
    () => [
      { label: "Overview", href: "/admin/dashboard", icon: BarChart3 },
      {
        label: "Articles",
        href: "/admin/news-management/articles",
        icon: Newspaper,
      },
      { label: "Live Events", href: "/admin/live", icon: Video },
      { label: "Media", href: "/admin/media", icon: ImageIcon },
      { label: "Authors", href: "/admin/authors", icon: Users },
      {
        label: "Categories",
        href: "/admin/news-management/categories",
        icon: BookOpen,
      },
      {
        label: "Types",
        href: "/admin/news-management/manage-type",
        icon: Shapes,
      },
      {
        label: "Biography",
        href: "/admin/profile-management/biography",
        icon: User,
      },
      { label: "Reports", href: "/admin/reports", icon: Flag },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
    []
  );

  useEffect(() => {
    if (isLoading) return;

    if (isError || !data?.user) {
      router.push("/login");
      return;
    }

    if (data?.user?.role !== "admin") {
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
    </div>
  );
}
