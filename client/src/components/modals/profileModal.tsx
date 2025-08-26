"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textArea";
import { Input } from "../ui/input";
import { useUpdateUser } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function ProfileModal({
  user,
  open,
  setOpen,
}: {
  user: any;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [profilePhoto, setProfilePhoto] = useState(
    user?.profilePhoto?.url || ""
  );
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const { mutate: updateUser, isPending } = useUpdateUser();

  const initials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0]?.toUpperCase() ?? "")
      .join("");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const data = new FormData();
    data.append("username", formData.username);
    data.append("phone", formData.phone);
    data.append("bio", formData.bio);
    if (file) data.append("file", file);

    updateUser(
      { userId: user._id, formData: data },
      {
        onSuccess: () => {
          toast.success("Profile updated");
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Please try again");
        },
      }
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-lg bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
              Your Profile
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-5 py-6">
            <div className="relative">
              <Avatar
                src={preview || profilePhoto}
                alt={user?.username || user?.email}
                fallback={initials(user?.username || user?.email)}
                className="h-24 w-24 rounded-full border-4 border-indigo-500/60 shadow-lg"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-2 py-1 rounded cursor-pointer">
                Change
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="w-full space-y-4">
              <div>
                <label className="text-sm text-slate-400">Username</label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 bg-slate-800/70 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">Email</label>
                <Input
                  name="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-slate-800/70 border-slate-600 text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 bg-slate-800/70 border-slate-600 text-white"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400">Bio</label>
                <Textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 bg-slate-800/70 border-slate-600 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 w-full mt-6">
              <Button
                variant="outline"
                className="w-1/2 rounded-xl border-slate-600 text-slate-300 hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="w-1/2 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:opacity-90"
                onClick={handleSave}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
