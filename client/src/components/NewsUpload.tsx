"use client";

import React, { FC, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { toast } from "react-toastify";
import { UploadCloud } from "react-feather";
import NewsForm from "./forms/News";
import ModalContainer from "./modals/Container";
import { useCreateNews, useVideoUpload } from "@/hooks/useNews";
import { Colors } from "@/utils/Colors";

interface NewsUploadProps {
  visible: boolean;
  onClose: () => void;
}

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

const NewsUpload: FC<NewsUploadProps> = ({ visible, onClose }) => {
  const [videoSelected, setVideoSelected] = useState(false);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newsUploaded, setNewsUploaded] = useState(false);
  const [newsUploadProgress, setNewsUploadProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploadVideo, setUploadVideo] = useState(false);

  const { mutateAsync: uploadVideoMutation } = useVideoUpload();
  const { mutateAsync: createNewsMutation } = useCreateNews();

  const handleTypeError = (error: string) => toast.error(error);

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

  const handleChange = (file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("folder", "news-assets");
    setVideoSelected(true);
    handleUploadVideo(formData);
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
    if (busy) return;
    try {
      setBusy(true);
      if (videoInfo) {
        data.append("video", JSON.stringify(videoInfo));
      }
      data.append("folder", "news-assets");

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
    <ModalContainer
      visible={visible}
      onClose={onClose}
      className="mt-20 md:mx-0 mx-16"
    >
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
        <NewsForm busy={busy} onSubmit={handleSubmit} btnTitle="" />
      )}
    </ModalContainer>
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
      >
        <label
          className="w-48 h-48 border border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer"
          style={{ borderColor: Colors.lightSubtle, color: Colors.secondary }}
        >
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
      <p className="mx-20 items-center font-semibold text-light-subtle animate-pulse mt-1 text-center">
        {message}
      </p>
    </div>
  );
};

export default NewsUpload;
