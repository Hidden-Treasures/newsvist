"use client";

import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "react-feather";
import { useCreateNews, useVideoUpload } from "@/hooks/useNews";
import { Colors } from "@/utils/Colors";
import NewsOrLiveUpdate from "./NewsOrLiveUpdate";

interface VideoInfo {
  url: string;
  public_id: string;
}

interface UploadProgressProps {
  width: number;
  message: string;
  visible: boolean;
}

interface VideoSelectorProps {
  visible: boolean;
  handleChange: (file: File) => void;
}

const CreateNewsForm: FC = () => {
  const [videoSelected, setVideoSelected] = useState<boolean>(false);
  const [videoUploaded, setVideoUploaded] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [newsUploaded, setNewsUploaded] = useState<boolean>(false);
  const [newsUploadProgress, setNewsUploadProgress] = useState<number>(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [busy, setBusy] = useState<boolean>(false);
  const [uploadVideo, setUploadVideo] = useState<boolean>(false);

  const { mutateAsync: uploadVideoMutation } = useVideoUpload();
  const { mutateAsync: createNewsMutation } = useCreateNews();

  const resetForm = () => {
    setVideoSelected(false);
    setVideoUploaded(false);
    setUploadProgress(0);
    setNewsUploaded(false);
    setNewsUploadProgress(0);
    setVideoInfo(null);
    setUploadVideo(false);
    setBusy(false);
  };

  const handleChange = (file: File) => {
    const MAX_FILE_SIZE_MB = 100;
    const maxSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
      return;
    }
    const formData = new FormData();
    formData.append("video", file);
    setVideoSelected(true);
    handleUploadVideo(formData);
  };

  const handleUploadVideo = async (data: FormData) => {
    try {
      setBusy(true);
      const result = await uploadVideoMutation({
        formData: data,
        onUploadProgress: (progress: number) => setUploadProgress(progress),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setVideoUploaded(true);
      setVideoInfo({ url: result.url, public_id: result.public_id });
      toast.success("Video uploaded successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload video");
    } finally {
      setBusy(false);
    }
  };

  const getUploadProgressValue = () => {
    if (
      !videoUploaded &&
      !newsUploaded &&
      newsUploadProgress &&
      uploadProgress >= 100
    ) {
      return "Processing...";
    }

    return `Uploading... ${uploadProgress || newsUploadProgress}%`;
  };

  const handleSubmit = async (data: FormData, resetNewsForm: () => void) => {
    try {
      setBusy(true);
      if (videoInfo) {
        data.append("video", JSON.stringify(videoInfo));
      }
      data.append("folder", "news_assets");

      const result = await createNewsMutation({
        formData: data,
        onUploadProgress: (progress: number) => setNewsUploadProgress(progress),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setNewsUploaded(true);
      toast.success("News uploaded successfully.");

      resetForm();
      resetNewsForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload news");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mt-16 max-w-4xl mx-auto p-6 bg-slate-900/70 border border-slate-800 rounded-2xl shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 text-slate-200">
          <input
            type="checkbox"
            checked={uploadVideo}
            onChange={() => setUploadVideo(!uploadVideo)}
            className="form-checkbox h-5 w-5 text-green-500 cursor-pointer"
          />
          Upload Video
        </label>
        {uploadVideo && videoSelected && !videoUploaded && (
          <UploadProgress
            visible
            width={uploadProgress}
            message={getUploadProgressValue()}
          />
        )}
      </div>

      {uploadVideo && !videoSelected ? (
        <VideoSelector visible handleChange={handleChange} />
      ) : (
        <NewsOrLiveUpdate
          busy={busy}
          onSubmit={handleSubmit}
          btnTitle="Publish"
          videoUploaded={videoUploaded}
          initialState={newsUploaded ? {} : undefined}
        />
      )}
    </div>
  );
};

const VideoSelector: FC<VideoSelectorProps> = ({ visible, handleChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "video/mp4": [], "video/x-msvideo": [] },
    multiple: false,
    onDrop: (acceptedFiles) =>
      acceptedFiles[0] && handleChange(acceptedFiles[0]),
    onDropRejected: () => toast.error("Only .mp4 or .avi allowed"),
  });

  if (!visible) return null;

  return (
    <div className="flex justify-center">
      <div
        {...getRootProps()}
        className="w-56 h-56 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition hover:bg-slate-800/40"
        style={{ borderColor: Colors.lightSubtle, color: Colors.secondary }}
      >
        <input {...getInputProps()} />
        <UploadCloud size={64} />
        <p className="text-center text-slate-400 mt-2 text-sm">
          Drop your video or click to upload
        </p>
      </div>
    </div>
  );
};

const UploadProgress: FC<UploadProgressProps> = ({
  width,
  message,
  visible,
}) => {
  if (!visible) return null;
  return (
    <div className="relative w-full h-4 rounded-full overflow-hidden bg-slate-800 mt-2">
      <div
        className="absolute top-0 left-0 h-full transition-all duration-200 ease-in-out bg-green-500"
        style={{ width: `${width}%` }}
      />
      <div className="absolute w-full text-center text-xs text-slate-100 font-medium">
        {width < 100 ? `${width}%` : message}
      </div>
    </div>
  );
};

export default CreateNewsForm;
