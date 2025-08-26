"use client";

import { useState, DragEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, UploadCloud } from "lucide-react";
import { useUploadMedia } from "@/hooks/useNews";

interface UploadMediaModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

type UploadingFile = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
};

export default function UploadMediaModal({
  open,
  setOpen,
}: UploadMediaModalProps) {
  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const { mutate: uploadMutation } = useUploadMedia();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const unique = newFiles.filter(
      (f) =>
        !files.some(
          (existing) =>
            existing.file.name === f.name && existing.file.size === f.size
        )
    );
    const mapped = unique.map((f) => ({
      file: f,
      progress: 0,
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 Auto-start upload for files with "pending" status
  useEffect(() => {
    files.forEach((item, index) => {
      if (item.status === "pending") {
        startUpload(index);
      }
    });
  }, [files]);

  const startUpload = (index: number) => {
    const file = files[index];

    setFiles((prev) =>
      prev.map((f, i) =>
        i === index ? { ...f, status: "uploading", progress: 0 } : f
      )
    );

    uploadMutation(file.file, {
      onSuccess: () => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: "done", progress: 100 } : f
          )
        );
      },
      onError: () => {
        setFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, status: "error" } : f))
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-xl p-5 md:p-8 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-white">
            Upload Media
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-400">
            Drag & drop or select multiple files (images, videos, or documents).
          </DialogDescription>
        </DialogHeader>

        {/* Upload Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`mt-4 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition ${
            dragOver
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 hover:bg-slate-800/40"
          }`}
        >
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <UploadCloud className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-gray-300 font-medium">Click to upload</p>
            <p className="text-sm text-gray-500">or drag and drop files here</p>
          </label>
        </div>

        {/* File List with Progress */}
        {files.length > 0 && (
          <div className="mt-6 max-h-72 overflow-y-auto pr-2 space-y-4">
            {files.map((item, index) => {
              const file = item.file;
              const isImage = file.type.startsWith("image/");
              const isVideo = file.type.startsWith("video/");

              return (
                <div
                  key={index}
                  className="relative bg-slate-900 rounded-lg p-3 border border-slate-700"
                >
                  {/* Remove Button (only before upload starts) */}
                  {item.status === "pending" && (
                    <button
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                      onClick={() => removeFile(index)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  <div className="flex items-center gap-4">
                    {/* Preview */}
                    {isImage ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="rounded-lg object-cover h-16 w-16"
                      />
                    ) : isVideo ? (
                      <video
                        src={URL.createObjectURL(file)}
                        className="rounded-lg object-cover h-16 w-16"
                      />
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center bg-slate-800 rounded-lg text-gray-400 text-xs">
                        {file.name.split(".").pop()?.toUpperCase()}
                      </div>
                    )}

                    {/* File Info + Progress */}
                    <div className="flex-1">
                      <p className="text-gray-200 text-sm font-medium">
                        {file.name}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            item.status === "done"
                              ? "bg-green-500"
                              : item.status === "error"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
