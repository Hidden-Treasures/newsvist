"use client";

import React, { FC, useState } from "react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "react-feather";
import NewsForm from "./News";
import { useCreateNews, useVideoUpload } from "@/hooks/useNews";
import { Colors } from "@/utils/Colors";

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
  const [isAdvertisement, setIsAdvertisement] = useState<boolean>(false);

  const { mutateAsync: uploadVideoMutation } = useVideoUpload();
  const { mutateAsync: createNewsMutation } = useCreateNews();

  const resetForm = () => {
    setVideoSelected(false);
    setVideoUploaded(false);
    setIsAdvertisement(false);
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
    <div className={"mt-24 w-fit ml-10"}>
      <div className="mb-5">
        <div className="flex flex-col min-h-[100px]">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={uploadVideo}
              onChange={() => setUploadVideo(!uploadVideo)}
              className="form-checkbox h-5 w-5 text-gray-600 cursor-pointer"
            />
            <span className="text-gray-400">Upload Video</span>
          </label>
          <div className="flex-grow"></div>{" "}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isAdvertisement}
              onChange={(e) => setIsAdvertisement(e.target.checked)}
              className="h-5 w-5 text-gray-300 cursor-pointer"
            />
            <span className="text-gray-400">Post as Advertisement</span>
          </label>
        </div>
        {uploadVideo && (
          <UploadProgress
            visible={!videoUploaded && videoSelected}
            message={getUploadProgressValue()}
            width={uploadProgress}
          />
        )}
      </div>
      {uploadVideo && !videoSelected ? (
        <VideoSelector visible={!videoSelected} handleChange={handleChange} />
      ) : (
        <div>
          <NewsForm
            busy={busy}
            onSubmit={(formData) => {
              if (!busy) handleSubmit(formData, () => resetForm());
            }}
            btnTitle=""
            videoUploaded={videoUploaded}
            isAdvertisement={isAdvertisement}
            setIsAdvertisement={setIsAdvertisement}
          />
        </div>
      )}
    </div>
  );
};

const VideoSelector: FC<VideoSelectorProps> = ({ visible, handleChange }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/mp4": [],
      "video/x-msvideo": [],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        handleChange(file);
      }
    },
    onDropRejected: () => {
      toast.error("Only .mp4 or .avi files are accepted.");
    },
  });

  if (!visible) return null;

  return (
    <div className="h-full flex items-center justify-center">
      <div
        {...getRootProps()}
        className="w-48 h-48 border-2 border-dashed rounded-full flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
        style={{ borderColor: Colors.lightSubtle, color: Colors.secondary }}
      >
        <input {...getInputProps()} />
        <UploadCloud size={80} />
        <p className="text-center">Drop your video here or click to upload</p>
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
