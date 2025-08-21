import { Plus } from "lucide-react";
import Link from "next/link";
import React, { Dispatch, FC, SetStateAction, useMemo } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

interface SidebarProps {
  openCreate: boolean;
  nav: { href: string; label: string; icon: any }[];
  setOpenCreate: Dispatch<SetStateAction<boolean>>;
}

const Sidebar: FC<SidebarProps> = ({ openCreate, nav, setOpenCreate }) => {
  const pathname = usePathname();

  return (
    <>
      <aside className="hidden lg:block">
        <nav className="sticky top-20 space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-2xl border transition ${
                pathname === n.href
                  ? "bg-slate-800/70 border-slate-700"
                  : "hover:bg-slate-800/40 border-transparent"
              }`}
            >
              {n.icon && <n.icon className="w-4.5 h-4.5" />}
              <span className="text-sm">{n.label}</span>
            </Link>
          ))}
          <div className="pt-4">
            <Button className="w-full" onClick={() => setOpenCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </Button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
