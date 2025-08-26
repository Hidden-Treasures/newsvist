import React, { FC, RefObject } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Bell, ChartAreaIcon as ChartArea, Menu, Search } from "lucide-react";
import { Input } from "./ui/input";
import UserMenu from "./UserMenu";
import {
  useFetchNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/useNotification";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown";
import { Notification } from "@/services/types";

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  user: any;
}

const Header: FC<HeaderProps> = ({ setMobileOpen, searchRef, user }) => {
  const { data, isLoading } = useFetchNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const editor = user?.role === "editor";
  const isPrivileged = user?.role === "editor" || user?.role === "admin";

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-slate-900/70 bg-slate-900/50 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-2xl bg-slate-800 grid place-items-center">
            <ChartArea className="w-4 h-4" />
          </div>
          <span className="font-semibold tracking-tight">
            News {editor ? "Editor" : "Admin"}
          </span>
        </Link>

        {/* Search */}
        <div className="ml-auto w-full max-w-lg hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder={`Search articles,${
                editor ? "" : "authors, tags…"
              }  ( / )`}
              className="pl-9 bg-slate-800/60 border-slate-700"
            />
          </div>
        </div>

        <div className="ml-auto md:ml-4 flex items-center gap-1">
          {isPrivileged && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-[10px] grid place-items-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 max-h-96 overflow-y-auto">
                {isLoading && (
                  <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
                )}
                {notifications.length === 0 && !isLoading && (
                  <DropdownMenuItem disabled>
                    No new notifications
                  </DropdownMenuItem>
                )}
                {notifications.map((n: Notification) => (
                  <DropdownMenuItem
                    key={n._id}
                    onClick={() => markAsRead(n._id)}
                    className={`cursor-pointer ${
                      !n.isRead ? "font-semibold bg-slate-800/40" : ""
                    }`}
                  >
                    {n.message}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
