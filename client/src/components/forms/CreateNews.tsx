"use client";

import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import { FileUploader } from "react-drag-drop-files";
import { UploadCloud } from "react-feather";
import NewsForm from "./News";
import { useCreateNews, useVideoUpload } from "@/hooks/useNews";

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

  const handleTypeError = (error: string) => toast.error(error);

  const handleChange = (file: File) => {
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

  const handleSubmit = async (data: FormData) => {
    try {
      setBusy(true);
      if (videoInfo) {
        data.append("video", JSON.stringify(videoInfo));
      }

      const result = await createNewsMutation({
        formData: data,
        onUploadProgress: (progress: number) => setNewsUploadProgress(progress),
      });

      if (result.error) {
        throw new Error(result.error);
      }

      setNewsUploaded(true);
      toast.success("News uploaded successfully.");
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
        {uploadVideo && (
          <UploadProgress
            visible={!videoUploaded && videoSelected}
            message={getUploadProgressValue()}
            width={uploadProgress}
          />
        )}
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
              if (!busy) handleSubmit(formData);
            }}
            btnTitle=""
          />
        </div>
      )}
    </div>
  );
};

const VideoSelector: React.FC<VideoSelectorProps> = ({
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
        <label className="w-48 h-48 border border-dashed border-light-subtle rounded-full flex flex-col items-center justify-center text-secondary cursor-pointer">
          <UploadCloud size={80} />
          <p>Drop your file here!</p>
        </label>
      </FileUploader>
    </div>
  );
};

const UploadProgress: React.FC<UploadProgressProps> = ({
  width,
  message,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="items-center text-center bg-white drop-shadow-lg rounded p-3">
      <div className="relative h-3 bg-light-subtle overflow-hidden">
        <div
          style={{ width: `${width}%` }}
          className="h-full max-w-full absolute left-0 bg-secondary"
        />
      </div>
      <p className="mx-20 items-center font-semibold text-light-subtle animate-pulse mt-1 text-center !bg-green-500">
        {message}
      </p>
    </div>
  );
};

export default CreateNewsForm;
