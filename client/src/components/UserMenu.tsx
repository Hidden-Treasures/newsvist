import { ChevronDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
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

export default function UserMenu({ user }: { user: any }) {
  const router = useRouter();
  const { logout } = useAuth();

  const initials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar
            src={user?.profilePhoto || ""}
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
        <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" onClick={logout} /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
