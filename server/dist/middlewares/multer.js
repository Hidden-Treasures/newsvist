"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const cloud_1 = require("../cloud");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 },
});
const uploadToCloudinary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handle single or multiple files
        const files = req.files
            ? req.files
            : req.file
                ? [req.file]
                : [];
        if (!files || files.length === 0) {
            return next();
        }
        const userId = req.params.userId || "assets";
        let baseFolder = typeof req.body.folder === "string" ? req.body.folder : `news_${userId}`;
        baseFolder = baseFolder.replace(/[^a-zA-Z0-9_\/-]/g, "");
        const cloudinaryUrls = [];
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
                buffer = yield (0, sharp_1.default)(file.buffer)
                    .resize({ width: 1280, height: 720 })
                    .toBuffer();
            }
            // Set resource type for Cloudinary
            const resourceType = isImage ? "image" : "video";
            const publicId = `${req.params.userId || "file"}_${Date.now()}`;
            const uploadStream = yield cloud_1.cloudinary.uploader.upload_stream({
                resource_type: resourceType,
                folder,
                public_id: publicId,
                chunk_size: isVideo ? 6000000 : undefined,
                transformation: isImage ? { width: 1280, height: 720 } : undefined,
                responsive_breakpoints: isImage
                    ? { create_derived: true, max_width: 640, max_images: 3 }
                    : undefined,
            }, (err, result) => {
                var _a, _b;
                if (err) {
                    console.error("Cloudinary upload error:", err);
                    return next(err);
                }
                if (!result) {
                    console.log("No result returned from Cloudinary upload");
                    return next(new Error("Failed to upload image to Cloudinary"));
                }
                const fileData = {
                    url: result.secure_url,
                    public_id: result.public_id,
                };
                if (isImage && ((_b = (_a = result.responsive_breakpoints) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.breakpoints)) {
                    fileData.responsive =
                        result.responsive_breakpoints[0].breakpoints.map((bp) => bp.secure_url);
                }
                cloudinaryUrls.push(fileData);
                if (cloudinaryUrls.length === files.length) {
                    req.body.cloudinaryUrls = cloudinaryUrls;
                    next();
                }
            });
            uploadStream.end(buffer);
        }
    }
    catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return next(new Error("Failed to upload files to Cloudinary"));
    }
});
exports.uploadToCloudinary = uploadToCloudinary;
