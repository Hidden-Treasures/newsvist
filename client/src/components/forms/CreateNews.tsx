"use client";

import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import { FileUploader } from "react-drag-drop-files";
import { UploadCloud } from "react-feather";
import NewsForm from "./News";
import { useCreateNews, useVideoUpload } from "@/hooks/useNews";
import { Colors } from "@/utils/Colors";

// Define types
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
  onTypeError: (error: string) => void;
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

  const handleTypeError = (error: string) => toast.error(error);

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
    <div className={"mt-24 w-fit ml-10"}>
      <div className="mb-5">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={uploadVideo}
            onChange={() => setUploadVideo(!uploadVideo)}
            className="form-checkbox h-5 w-5 text-gray-600 cursor-pointer"
          />
          <span className="text-gray-700">Upload Video</span>
        </label>

        <UploadProgress
          visible={!videoUploaded && videoSelected}
          message={getUploadProgressValue()}
          width={uploadProgress}
        />
      </div>
      {uploadVideo && !videoSelected ? (
        <VideoSelector
          visible={!videoSelected}
          onTypeError={handleTypeError}
          handleChange={handleChange}
        />
      ) : (
        <div>
          <NewsForm
            busy={busy}
            onSubmit={(formData) => {
              if (!busy) handleSubmit(formData, () => resetForm());
            }}
            btnTitle=""
            videoUploaded={videoUploaded}
          />
        </div>
      )}
    </div>
  );
};

const VideoSelector: FC<VideoSelectorProps> = ({
  visible,
  handleChange,
  onTypeError,
}) => {
  if (!visible) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <FileUploader
        handleChange={handleChange}
        onTypeError={onTypeError}
        types={["mp4", "avi"]}
        name="video"
      >
        <label
          className="w-48 h-48 border border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer"
          style={{ borderColor: Colors.lightSubtle, color: Colors.secondary }}
        >
          <UploadCloud size={80} />
          <p>Drop your file here!</p>
          <p className="text-sm text-gray-500 mt-2">(Max size: 100MB)</p>
        </label>
      </FileUploader>
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
    <div
      className="relative w-full h-12 rounded-lg overflow-hidden shadow-md text-center text-white font-semibold"
      style={{
        background: "#d1fae5",
      }}
    >
      <div
        className="absolute top-0 left-0 h-full transition-all duration-200 ease-in-out"
        style={{
          width: `${width}%`,
          backgroundColor: "#10b981",
        }}
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        {typeof width === "number" && width < 100 ? (
          <span style={{ color: "#065f46" }}>{width}%</span>
        ) : (
          <span style={{ color: "#065f46" }}>{message}</span>
        )}
      </div>
    </div>
  );
};

export default CreateNewsForm;
