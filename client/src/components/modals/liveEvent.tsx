"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LiveEvents from "../forms/LiveEvent";

interface LiveEventsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function LiveEventsModal({
  open,
  setOpen,
}: LiveEventsModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-5xl h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl p-5 md:p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-white">
            Publish Live Event
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Configure and publish a live news event updates.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 mt-4">
          <LiveEvents />
        </div>
      </DialogContent>
    </Dialog>
  );
}
