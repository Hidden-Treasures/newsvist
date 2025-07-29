import { NextFunction, Request, Response } from "express";
import multer, { Multer } from "multer";
import sharp from "sharp";
import {
  cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "../cloud";

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer;
}
const storage = multer.memoryStorage();
export const upload: Multer = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Handle single or multiple files
    const files: CloudinaryFile[] = req.files
      ? (req.files as CloudinaryFile[])
      : req.file
      ? [req.file as CloudinaryFile]
      : [];
    if (!files || files.length === 0) {
      return next();
    }

    const userId = req.params.userId || "assets";
    let baseFolder =
      typeof req.body.folder === "string" ? req.body.folder : `news_${userId}`;
    baseFolder = baseFolder.replace(/[^a-zA-Z0-9_\/-]/g, "");

    const cloudinaryUrls: { url: string; public_id: string }[] = [];

    for (const file of files) {
      // Determine resource type based on MIME type
      const isImage = file.mimetype.startsWith("image/");
      const isVideo = file.mimetype.startsWith("video/");
      const subFolder = isImage ? "images" : isVideo ? "videos" : "others";

      if (!isImage && !isVideo) {
        console.warn(`Unsupported file type: ${file.mimetype}`);
        continue;
      }

      if (!isVideo && req.originalUrl.includes("/upload-video")) {
        return next(new Error("Only video files are allowed for this route"));
      }

      const folder = `${baseFolder}/${subFolder}`;
      let buffer = file.buffer;

      // Resize image if it's an image file
      if (isImage) {
        buffer = await sharp(file.buffer)
          .resize({ width: 1280, height: 720 })
          .toBuffer();
      }

      // Set resource type for Cloudinary
      const resourceType = isImage ? "image" : "video";
      const publicId = `${req.params.userId || "file"}_${Date.now()}`;
      const uploadStream = await cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
          public_id: publicId,
          chunk_size: isVideo ? 6000000 : undefined,
          transformation: isImage ? { width: 1280, height: 720 } : undefined,
          responsive_breakpoints: isImage
            ? { create_derived: true, max_width: 640, max_images: 3 }
            : undefined,
        },
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (err) {
            console.error("Cloudinary upload error:", err);
            return next(err);
          }
          if (!result) {
            console.log("No result returned from Cloudinary upload");
            return next(new Error("Failed to upload image to Cloudinary"));
          }
          const fileData: {
            url: string;
            public_id: string;
            responsive?: string[];
          } = {
            url: result.secure_url,
            public_id: result.public_id,
          };

          if (isImage && result.responsive_breakpoints?.[0]?.breakpoints) {
            fileData.responsive =
              result.responsive_breakpoints[0].breakpoints.map(
                (bp: any) => bp.secure_url
              );
          }

          cloudinaryUrls.push(fileData);

          if (cloudinaryUrls.length === files.length) {
            req.body.cloudinaryUrls = cloudinaryUrls;
            next();
          }
        }
      );
      uploadStream.end(buffer);
    }
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return next(new Error("Failed to upload files to Cloudinary"));
  }
};
