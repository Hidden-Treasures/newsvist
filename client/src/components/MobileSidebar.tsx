"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, ChartArea } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scrollArea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MobileSidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  nav: { href: string; label: string; icon: any }[];
  setOpenCreate: (open: boolean) => void;
}

export default function MobileSidebar({
  open,
  setOpen,
  nav,
  setOpenCreate,
}: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="p-0 w-[280px] text-gray-300 bg-slate-950 border-slate-800"
      >
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle className="flex items-center gap-2 text-gray-300">
            <div className="w-8 h-8 rounded-2xl bg-slate-800 grid place-items-center">
              <ChartArea className="w-4 h-4" />
            </div>
            News Admin
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-72px)] px-3 pb-6">
          <nav className="space-y-1">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
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
          </nav>

          <div className="px-1 pt-4">
            <Button
              className="w-full"
              onClick={() => {
                setOpenCreate(true);
                setOpen(false);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </Button>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
