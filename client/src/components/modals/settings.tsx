"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Upload } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SettingsModal({ open, setOpen }: SettingsModalProps) {
  const [siteTitle, setSiteTitle] = useState("RoyalKatd News");
  const [siteDescription, setSiteDescription] = useState(
    "Latest news and updates."
  );
  const [darkMode, setDarkMode] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    // simulate API call
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg rounded-2xl p-6 bg-slate-900 text-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            ⚙️ Website Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Site Title */}
          <div>
            <Label className="text-gray-300">Site Title</Label>
            <Input
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Site Description */}
          <div>
            <Label className="text-gray-300">Site Description</Label>
            <Input
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="mt-1 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          {/* Dark Mode */}
          <div className="flex items-center justify-between">
            <Label className="text-gray-300">Enable Dark Mode</Label>
            <Switch enabled={darkMode} onChange={setDarkMode} />
          </div>

          {/* Layout */}
          <div>
            <Label className="text-gray-300 mb-1 block">Homepage Layout</Label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full rounded-md bg-slate-800 border border-slate-700 px-3 py-2 text-white"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>

          {/* Logo Upload */}
          <div>
            <Label className="text-gray-300 mb-1 block">Logo</Label>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-800"
            >
              <Upload className="w-4 h-4" />
              Upload Logo
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
