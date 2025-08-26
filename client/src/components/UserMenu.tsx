"use client";

import { ChevronDown, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown";
import { Button } from "./ui/button";
import { Avatar } from "./ui/avatar";
import { useAuth } from "@/context/AuthContext";
import ProfileModal from "./modals/profileModal";
import { useState } from "react";
import SettingsModal from "./modals/settings";

export default function UserMenu({ user }: { user: any }) {
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const initials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <Avatar
              src={user?.profilePhoto?.url || ""}
              alt={user?.username || user?.email}
              fallback={initials(user?.username || user?.email)}
              className="h-7 w-7"
            />

            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Signed in as {user?.email || "admin"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user?.role === "admin" && (
            <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
              Settings
            </DropdownMenuItem>
          )}

          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ProfileModal user={user} open={profileOpen} setOpen={setProfileOpen} />
      <SettingsModal open={settingsOpen} setOpen={setSettingsOpen} />
    </>
  );
}
