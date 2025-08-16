"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createImage = exports.moderateComment = exports.getAnalytics = exports.rejectNews = exports.approveNews = exports.getRejectedNews = exports.getApprovedNews = exports.getPendingNews = exports.getMostReadArticles = exports.getUpNextArticles = exports.getNewsAndBuzz = exports.getRelatedNews = exports.getImageArticlesByCategory = exports.getArticlesByCategory = exports.getNewsBySlug = exports.getNewsByTags = exports.getMissedNews = exports.getNews = exports.getMostRecentNews = exports.getHeadLine = exports.getUserbyID = exports.updateUserData = exports.deleteUsersManually = exports.users = exports.assignRole = exports.updateSubCategory = exports.updateCategory = exports.addCategory = exports.deleteSubCategory = exports.deleteCategory = exports.AllCategoriesWithSubCategory = exports.restoreNews = exports.deleteNews = exports.addToNewsRecycleBin = exports.getNewsById = exports.getNewsForUpdate = exports.updateNews = exports.writerNewsList = exports.editorNewsList = exports.allNewsList = exports.newsList = exports.getAllNewsSubCategories = exports.getAllNewsCategories = exports.getNewsType = exports.deleteType = exports.addType = exports.getAdvertisements = exports.createNews = exports.getLastFiveLiveUpdateNewsType = exports.videoUpload = void 0;
exports.getAllLiveUpdates = exports.getNewsByLiveUpdateType = exports.getOldestNewsArticleByType = exports.mainSearch = exports.getDeletedNews = exports.getSingleImage = exports.images = exports.deleteImageByUser = exports.getImagesByCategoryOrTag = exports.getAllImages = exports.getImages = void 0;
const helper_1 = require("../utils/helper");
const News_1 = __importDefault(require("../models/News"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Biography_1 = __importDefault(require("../models/Biography"));
const Subscription_1 = __importDefault(require("../models/Subscription"));
const Type_1 = __importDefault(require("../models/Type"));
const Category_1 = __importDefault(require("../models/Category"));
const Subcategory_1 = __importDefault(require("../models/Subcategory"));
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("../models/User"));
const Image_1 = __importDefault(require("../models/Image"));
const Comment_1 = __importDefault(require("../models/Comment"));
const slugify_1 = __importDefault(require("slugify"));
const cloud_1 = require("../cloud");
function generateUniqueSlug(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nanoid } = yield Promise.resolve().then(() => __importStar(require("nanoid")));
        const baseSlug = (0, slugify_1.default)(title, { lower: true, strict: true });
        let slug = baseSlug;
        let exists = yield News_1.default.findOne({ slug });
        while (exists) {
            const suffix = nanoid(4);
            slug = `${baseSlug}-${suffix}`;
            exists = yield News_1.default.findOne({ slug });
        }
        return slug;
    });
}
const { isValidObjectId } = require("mongoose");
const { subDays } = require("date-fns");
const webpush = require("web-push");
// Your VAPID keys from web-push setup
webpush.setVapidDetails("mailto:newsvist@gmail.com", process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
const videoUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.body.cloudinaryUrls || req.body.cloudinaryUrls.length === 0) {
            return res.status(400).json({ error: "Video upload failed" });
        }
        const { url, public_id } = req.body.cloudinaryUrls[0];
        res.status(201).json({ url, public_id });
    }
    catch (error) {
        console.error("Error in video upload:", error);
        res.status(500).json({ error: "Server error" });
    }
});
exports.videoUpload = videoUpload;
const getLastFiveLiveUpdateNewsType = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const lastFiveLiveUpdates = yield News_1.default.find({ isLiveUpdate: true })
                .sort({ createdAt: -1 })
                .limit(5);
            res.json(lastFiveLiveUpdates);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error. " });
        }
    });
};
exports.getLastFiveLiveUpdateNewsType = getLastFiveLiveUpdateNewsType;
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const role = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        const isAdmin = role === "admin";
        const isEditor = role === "editor";
        const { title, newsCategory, subCategory, type, tags, editorText, authorName, isLiveUpdate, liveUpdateType, liveUpdateHeadline, video, city, name, isAdvertisement, } = req.body;
        let bioId = null;
        if (name) {
            const bio = yield Biography_1.default.findOne({
                stageName: new RegExp(`^${name}$`, "i"),
            });
            if (bio) {
                bioId = bio._id;
            }
        }
        const slug = yield generateUniqueSlug(title);
        const newNews = new News_1.default({
            title,
            slug,
            newsCategory,
            subCategory,
            type,
            tags: Array.isArray(tags) ? tags : [tags],
            editorText,
            authorName,
            isLiveUpdate,
            liveUpdateType,
            liveUpdateHeadline,
            city,
            video,
            user: userId,
            name: bioId,
            isAdvertisement,
        });
        if (isAdmin || isEditor) {
            newNews.status = "approved";
            newNews.published = true;
        }
        // uploading Image file
        if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
            const cloudinaryUrls = req.body.cloudinaryUrls;
            const videoFile = cloudinaryUrls.find((file) => file.url.match(/\.mp4|\.mov|\.avi$/i));
            const imageFiles = cloudinaryUrls.filter((file) => file.url.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i));
            if (videoFile) {
                newNews.video = { url: videoFile.url, public_id: videoFile.public_id };
            }
            if (imageFiles.length > 0) {
                newNews.file = {
                    url: imageFiles[0].url,
                    public_id: imageFiles[0].public_id,
                    responsive: imageFiles[0].responsive || [],
                };
                newNews.images = imageFiles.map((file) => file.url);
            }
        }
        yield newNews.save();
        const year = newNews.createdAt.getFullYear();
        const month = String(newNews.createdAt.getMonth() + 1).padStart(2, "0");
        const day = String(newNews.createdAt.getDate()).padStart(2, "0");
        const category = newNews.newsCategory;
        const baseUrl = "https://www.newsvist.com";
        const articleUrl = `${baseUrl}/${year}/${month}/${day}/${category}/${newNews.slug}`;
        const categoryDisplay = newNews.newsCategory || "News";
        const payload = JSON.stringify({
            title: `NewsVist: ${categoryDisplay}`,
            body: `New: "${newNews.title}". Tap to read.`,
            url: articleUrl,
            image: ((_c = newNews.file) === null || _c === void 0 ? void 0 : _c.url) || ((_d = newNews.images) === null || _d === void 0 ? void 0 : _d[0]) || undefined,
        });
        let query = {
            $or: [
                { categories: { $exists: false } },
                { categories: { $size: 0 } },
                { categories: newNews.newsCategory },
            ],
        };
        if (newNews.type === "BreakingNews") {
            query = {};
        }
        const subscriptions = yield Subscription_1.default.find(query);
        subscriptions.forEach((subDoc) => {
            const subscription = subDoc.toObject();
            webpush
                .sendNotification(subscription, payload, { TTL: 60 })
                .catch((err) => __awaiter(void 0, void 0, void 0, function* () {
                if (err.statusCode === 404 || err.statusCode === 410) {
                    console.log("Removing expired subscription:", subscription.endpoint);
                    yield Subscription_1.default.deleteOne({ endpoint: subscription.endpoint });
                }
                else {
                    console.error("Push error:", err);
                }
            }));
        });
        res.status(201).json({ news: { id: newNews._id, title } });
    }
    catch (err) {
        console.error("Error saving news:", err);
        res.status(500).json({ error: "Failed to save news" });
    }
});
exports.createNews = createNews;
const getAdvertisements = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ads = yield News_1.default.find({ isAdvertisement: true, published: true })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json(ads);
    }
    catch (err) {
        console.error("Error fetching ads:", err);
        res.status(500).json({ error: "Failed to fetch advertisements" });
    }
});
exports.getAdvertisements = getAdvertisements;
const addType = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name } = req.body;
        try {
            if (name) {
                const newType = new Type_1.default({ name });
                const savedType = yield newType.save();
                res.status(201).json(savedType);
            }
            else {
                res.status(500).json("Type not found");
            }
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error. " });
        }
    });
};
exports.addType = addType;
const deleteType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { typeId } = req.params;
    try {
        yield Type_1.default.findByIdAndDelete(typeId);
        res.json({ message: "Type deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteType = deleteType;
const getNewsType = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const allTypes = yield Type_1.default.find();
            res.json(allTypes);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error. " });
        }
    });
};
exports.getNewsType = getNewsType;
const getAllNewsCategories = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const categories = yield Category_1.default.find({}, "title");
            res.json(categories);
        }
        catch (error) {
            res.status(500).json({ error: "Internal Server Error. " });
        }
    });
};
exports.getAllNewsCategories = getAllNewsCategories;
const getAllNewsSubCategories = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const selectedCategory = req.params.catName;
        try {
            const category = yield Category_1.default.findOne({
                title: selectedCategory,
            }).populate("items");
            if (!category) {
                return res.status(404).json({ error: "Category Not Found." });
            }
            res.json(category.items);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error. " });
        }
    });
};
exports.getAllNewsSubCategories = getAllNewsSubCategories;
const newsList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
            const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
            const userId = req.user._id;
            const options = {
                page: page,
                limit: pageSize,
                sort: { createdAt: -1 },
            };
            const query = { user: userId, isDeleted: false };
            const paginatedNews = yield News_1.default.paginate(query, options);
            res.json({
                news: paginatedNews.docs,
                totalPages: paginatedNews.totalPages,
            });
        }
        catch (error) {
            console.error("Error fetching news data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.newsList = newsList;
const allNewsList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
            const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
            const role = req.user.role;
            const isAdmin = role === "admin";
            // Check if the user is an admin
            if (!isAdmin) {
                return res.status(403).json({ error: "Access denied" });
            }
            const options = {
                page: page,
                limit: pageSize,
                sort: { createdAt: -1 },
            };
            // No user filter here, fetch news from all users
            const query = { isDeleted: false };
            const paginatedNews = yield News_1.default.paginate(query, options);
            res.json({
                news: paginatedNews.docs,
                totalPages: paginatedNews.totalPages,
            });
        }
        catch (error) {
            console.error("Error fetching news data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.allNewsList = allNewsList;
const editorNewsList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
            const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
            const userId = req.user._id;
            const options = {
                page: page,
                limit: pageSize,
                sort: { createdAt: -1 },
            };
            const query = { user: userId, isDeleted: false };
            const paginatedNews = yield News_1.default.paginate(query, options);
            res.json({
                news: paginatedNews.docs,
                totalPages: paginatedNews.totalPages,
            });
        }
        catch (error) {
            console.error("Error fetching news data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.editorNewsList = editorNewsList;
const writerNewsList = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
            const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
            const writer = req.user._id;
            const options = {
                page: page,
                limit: pageSize,
                sort: { createdAt: -1 },
            };
            const query = { editor: writer, isDeleted: false };
            const paginatedNews = yield News_1.default.paginate(query, options);
            res.json({
                news: paginatedNews.docs,
                totalPages: paginatedNews.totalPages,
            });
        }
        catch (error) {
            console.error("Error fetching news data:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.writerNewsList = writerNewsList;
// export const filesForNewsByFilename = async function (req: Request, res: Response) {
//   // console.log("From filesForNewsByFilename");
//   client.connect().then(() => {
//     // Get the database and the GridFS bucket
//     const db = client.db("test");
//     const bucket = new mongodb.GridFSBucket(db);
//     // Get the filename from the request params
//     const filename = req.params.filename;
//     // Find the file by filename
//     async function handleFile() {
//       const file = await bucket.find({ filename }).toArray();
//       if (file.length > 0) {
//         const dataBuffer = [];
//         const downloadStream = bucket.openDownloadStreamByName(filename);
//         downloadStream.on("data", (chunk) => {
//           dataBuffer.push(chunk);
//         });
//         downloadStream.on("end", () => {
//           const data = Buffer.concat(dataBuffer);
//           // Now 'data' contains the binary data of the file
//           // Send the file data in the response
//           res.send(data);
//         });
//       } else {
//         console.log("File not found");
//         // Handle accordingly, send an error response, etc.
//       }
//     }
//     handleFile();
//   });
// };
// export const filesForNewsByFilename = async function (req: Request, res: Response) {
//   const { filename } = req.params;
//   const headObjectParams = {
//     Bucket: process.env.S3_BUCKET_NAME,
//     Key: filename,
//   };
//   try {
//     // Check if the file exists
//     await s3Client.send(new HeadObjectCommand(headObjectParams));
//     const getObjectParams = {
//       Bucket: process.env.S3_BUCKET_NAME,
//       Key: filename,
//     };
//     const command = new GetObjectCommand(getObjectParams);
//     const response = await s3Client.send(command);
//     // Stream the file directly to the response
//     const passThrough = new PassThrough();
//     response.Body.pipe(passThrough).pipe(res);
//   } catch (error) {
//     console.error("Error fetching file from S3", error);
//     // Handle specific S3 errors like NoSuchKey
//     if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
//       return res.status(404).send("File not found");
//     }
//     return res.status(500).send("Internal server error");
//   }
// };
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { newsId } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    if (!isValidObjectId(newsId))
        return (0, helper_1.sendError)(res, "Invalid News ID!");
    const news = yield News_1.default.findById(newsId);
    if (!news)
        return (0, helper_1.sendError)(res, "News Not Found!", 404);
    const { title, editorText, newsCategory, subCategory, type, authorName, tags, city, video, name, } = req.body;
    const slug = yield generateUniqueSlug(title);
    news.title = title;
    news.slug = slug;
    news.editorText = editorText;
    news.tags = Array.isArray(tags) ? tags : [tags];
    news.newsCategory = newsCategory;
    news.subCategory = subCategory;
    news.type = type;
    news.authorName = authorName;
    news.video = video;
    news.city = city;
    news.editor = userId;
    if (name) {
        const bio = yield Biography_1.default.findOne({ stageName: name });
        if (!bio) {
            return (0, helper_1.sendError)(res, "Person not found in the Bio collection", 404);
        }
        news.name = bio._id;
    }
    if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
        const cloudinaryUrls = req.body.cloudinaryUrls;
        const videoFile = cloudinaryUrls.find((file) => file.url.match(/\.mp4|\.mov|\.avi$/i));
        const imageFiles = cloudinaryUrls.filter((file) => file.url.match(/\.jpg|\.jpeg|\.png$/i));
        // Delete existing video if new video is provided
        if (videoFile && ((_b = news.video) === null || _b === void 0 ? void 0 : _b.public_id)) {
            const { result } = yield cloud_1.cloudinary.uploader.destroy(news.video.public_id, {
                resource_type: "video",
            });
            if (result !== "ok") {
                return (0, helper_1.sendError)(res, "Could not delete existing video!");
            }
        }
        if (videoFile) {
            news.video = { url: videoFile.url, public_id: videoFile.public_id };
        }
        // Delete existing image if new images are provided
        if (imageFiles.length > 0) {
            // Delete existing images
            if ((_c = news.file) === null || _c === void 0 ? void 0 : _c.public_id) {
                yield cloud_1.cloudinary.uploader.destroy(news.file.public_id);
            }
            if (news.images && news.images.length > 0) {
                for (const imgUrl of news.images) {
                    // Extract public_id from URL or keep a mapping in DB
                    const publicId = (_d = imgUrl.split("/").pop()) === null || _d === void 0 ? void 0 : _d.split(".")[0];
                    if (publicId)
                        yield cloud_1.cloudinary.uploader.destroy(publicId);
                }
            }
            // Save new images
            news.file = {
                url: imageFiles[0].url,
                public_id: imageFiles[0].public_id,
                responsive: imageFiles[0].responsive || [],
            };
            news.images = imageFiles.map((file) => file.url);
        }
    }
    yield news.save();
    res.json({
        message: "News is updated",
        news: {
            id: news._id,
            title: news.title,
            file: (_e = news.file) === null || _e === void 0 ? void 0 : _e.url,
            newsCategory: news.newsCategory,
            type: news.type,
            name: news.name,
        },
    });
});
exports.updateNews = updateNews;
const getNewsForUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { newsId } = req.params;
    const editorId = req.user._id;
    if (!isValidObjectId(newsId))
        return (0, helper_1.sendError)(res, "Id is invalid!");
    const news = yield News_1.default.findById(newsId).populate("editor").populate({
        path: "name",
        select: "stageName realName",
    });
    if (!news) {
        return (0, helper_1.sendError)(res, "News Not Found!", 404);
    }
    res.json({
        news: {
            id: news._id,
            title: news.title,
            editorText: news.editorText,
            file: (_a = news.file) === null || _a === void 0 ? void 0 : _a.url,
            video: (_b = news.video) === null || _b === void 0 ? void 0 : _b.url,
            newsCategory: news.newsCategory,
            subCategory: news.subCategory,
            type: news.type,
            tags: news.tags,
            authorName: news.authorName,
            editor: editorId,
            name: news.name,
        },
    });
});
exports.getNewsForUpdate = getNewsForUpdate;
const getNewsById = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const articleId = req.params.id;
        try {
            // Find the news document by id
            const news = yield News_1.default.findById(articleId);
            // Return the news data
            res.send(news);
        }
        catch (error) {
            // Handle error
            console.error(error);
            throw error;
        }
    });
};
exports.getNewsById = getNewsById;
const addToNewsRecycleBin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newsId } = req.params;
    if (!isValidObjectId(newsId))
        return (0, helper_1.sendError)(res, "Invalid News ID!");
    const news = yield News_1.default.findById(newsId);
    if (!news)
        return (0, helper_1.sendError)(res, "News Not Found!", 404);
    news.isDeleted = true;
    news.deletedAt = new Date();
    yield news.save();
    res.json({ message: "News moved to Recycle Bin successfully." });
});
exports.addToNewsRecycleBin = addToNewsRecycleBin;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { newsId } = req.params;
        if (!isValidObjectId(newsId))
            return (0, helper_1.sendError)(res, "Invalid News ID!");
        const news = yield News_1.default.findById(newsId);
        if (!news)
            return (0, helper_1.sendError)(res, "News Not Found!", 404);
        if ((_a = news.file) === null || _a === void 0 ? void 0 : _a.public_id) {
            const { result } = yield cloud_1.cloudinary.uploader.destroy(news.file.public_id);
            if (result !== "ok" && result !== "not found") {
                console.error("Image deletion failed:", result);
            }
        }
        if ((_b = news.video) === null || _b === void 0 ? void 0 : _b.public_id) {
            const { result } = yield cloud_1.cloudinary.uploader.destroy(news.video.public_id, {
                resource_type: "video",
            });
            if (result !== "ok" && result !== "not found") {
                console.error("Video deletion failed:", result);
            }
        }
        yield News_1.default.findByIdAndDelete(newsId);
        res.json({ message: "News removed successfully." });
    }
    catch (err) {
        console.error("Error deleting news:", err);
        (0, helper_1.sendError)(res, "Something went wrong while deleting news!", 500);
    }
});
exports.deleteNews = deleteNews;
const restoreNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newsId } = req.params;
    if (!isValidObjectId(newsId))
        return (0, helper_1.sendError)(res, "Invalid News ID!");
    const news = yield News_1.default.findById(newsId);
    if (!news || !news.isDeleted)
        return (0, helper_1.sendError)(res, "News not found or not deleted.", 404);
    news.isDeleted = false;
    yield news.save();
    res.json({ message: "News restored successfully." });
});
exports.restoreNews = restoreNews;
const AllCategoriesWithSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category_1.default.find().populate("items", "name");
        res.status(200).json(categories);
    }
    catch (error) {
        console.error("Error getting categories:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.AllCategoriesWithSubCategory = AllCategoriesWithSubCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        yield Category_1.default.findByIdAndDelete(categoryId);
        res.json({ message: "Category deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteCategory = deleteCategory;
const deleteSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, subCategoryId } = req.params;
    try {
        const category = yield Category_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        category.items.pull(subCategoryId);
        yield category.save();
        // Delete the subcategory document
        yield Subcategory_1.default.findByIdAndDelete(subCategoryId);
        res.json({ message: "Subcategory deleted successfully!" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.deleteSubCategory = deleteSubCategory;
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, subcategories, parentCategory } = req.body;
    try {
        if (!subcategories || subcategories.length === 0) {
            const newCategory = new Category_1.default({ title: name });
            const savedCategory = yield newCategory.save();
            return res.status(201).json(savedCategory);
        }
        else {
            // Find parent
            const category = yield Category_1.default.findById(parentCategory);
            if (!category) {
                return res.status(404).json({
                    status: false,
                    message: "Parent category not found",
                });
            }
            const [subcategoryName] = subcategories;
            // Create new subcategory
            const newSubCategory = new Subcategory_1.default({ name: subcategoryName });
            const savedSubCategory = yield newSubCategory.save();
            category.items.push(savedSubCategory._id);
            const savedCategory = yield category.save();
            return res.status(201).json(savedCategory);
        }
    }
    catch (error) {
        console.error("Error adding category:", error.message);
        return res
            .status(500)
            .json({ status: false, message: "Internal server error" });
    }
});
exports.addCategory = addCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { categoryName } = req.body;
        const updatedCategory = yield Category_1.default.findByIdAndUpdate(id, { title: categoryName }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.json(updatedCategory);
    }
    catch (error) {
        res.status(500).json({ error: "Error updating category" });
    }
});
exports.updateCategory = updateCategory;
const updateSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, subcategoryId } = req.params;
        const { subcategoryName } = req.body;
        const category = yield Category_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        // Check if subcategoryId exists in category.items
        if (!category.items.includes(new mongoose_1.default.Types.ObjectId(subcategoryId))) {
            return res
                .status(404)
                .json({ error: "Subcategory not found in this category" });
        }
        const subcategory = yield Subcategory_1.default.findByIdAndUpdate(subcategoryId, { name: subcategoryName }, { new: true });
        if (!subcategory) {
            return res.status(404).json({ error: "Subcategory not found" });
        }
        res.json({
            success: true,
            message: "Subcategory updated successfully",
            data: subcategory,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Error updating subcategory" });
    }
});
exports.updateSubCategory = updateSubCategory;
const assignRole = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { userId } = req.params;
        const { role } = req.body;
        try {
            // Find the user by ID
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            // Update the user's role
            user.role = role;
            // Save the updated user
            yield user.save();
            res.status(200).json({ message: "Role assigned successfully" });
        }
        catch (error) {
            console.error("Error assigning role:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    });
};
exports.assignRole = assignRole;
const users = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield User_1.default.find();
            res.json(users);
        }
        catch (error) {
            console.error("Error fetching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.users = users;
const deleteUsersManually = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        // Check if the user exists
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Delete the user
        yield User_1.default.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteUsersManually = deleteUsersManually;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userid;
    const { username, phone, email, password, confirmPassword, bio, role } = req.body;
    try {
        // Find the user by ID
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Update username if provided
        if (username !== undefined) {
            user.username = username;
        }
        // Update phone if provided
        if (phone !== undefined) {
            user.phone = phone;
        }
        // Update email if provided
        if (email !== undefined) {
            user.email = email;
        }
        // Update bio if provided
        if (bio !== undefined) {
            user.bio = bio;
        }
        // Update role if provided
        if (role !== undefined) {
            user.role = role;
        }
        // Update password if provided and matches confirmPassword
        if (password !== undefined && password === confirmPassword) {
            // Hash the new password
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            user.password = hashedPassword;
        }
        // Save the updated user document
        yield user.save();
        // Respond with success message or updated user data
        res
            .status(200)
            .json({ message: "User updated successfully", user: user.toObject() });
    }
    catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.updateUserData = updateUserData;
const getUserbyID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userid;
    console.log("userID for user is:", userId);
    try {
        // Find a user by the provided user ID
        const user = yield User_1.default.findOne({ _id: userId });
        if (!user) {
            // Handle the case where the user is not found
            console.log("User not found");
            return res.status(404).json({ error: "User not found" });
        }
        // Return the user data
        return res.json(user);
    }
    catch (error) {
        // Handle errors
        console.error("Error fetching user data:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getUserbyID = getUserbyID;
// export const supportForm = async (req: Request, res: Response) => {
//   const { name, email, subject, message } = req.body;
//   try {
//     // Create a new support submission document
//     const supportSubmission = new SupportForm({
//       name,
//       email,
//       subject,
//       message,
//     });
//     // Save the document to the database
//     await supportSubmission.save();
//     console.log(
//       "Support form submission saved to the database:",
//       supportSubmission
//     );
//     res.status(200).json({ message: "Form submitted successfully" });
//   } catch (error) {
//     console.error("Error saving support form submission:", error);
//     console.error("Error saving support form submission:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
// export const getSupportForm = async (req: Request, res: Response) => {
//   try {
//     // Fetch all support details from the database
//     const supportDetails = await SupportForm.find().sort({ timestamp: -1 });
//     res.status(200).json(supportDetails);
//   } catch (error) {
//     console.error("Error fetching support details:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
const getHeadLine = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { liveUpdateType } = req.params;
        try {
            const lastLiveUpdate = yield News_1.default.findOne({
                liveUpdateType: liveUpdateType,
                isLiveUpdate: true,
            }).sort({ createdAt: -1 });
            if (lastLiveUpdate) {
                res.json(lastLiveUpdate.liveUpdateHeadline);
            }
            else {
                res.status(404).json({ error: "Live update not found" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.getHeadLine = getHeadLine;
const getMostRecentNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the most recent articles
        const recentArticles = yield News_1.default.find({ published: true })
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(6);
        // Fetch the most recent sports article in the Football subcategory
        const sportsArticle = yield News_1.default.findOne({
            published: true,
            newsCategory: "Sports",
            subCategory: "Football",
        })
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(1);
        // Fetch the most recent tech article and 5 other tech articles
        const recentTechArticle = yield News_1.default.findOne({
            published: true,
            newsCategory: "Tech",
        })
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(1);
        const otherTechArticles = yield News_1.default.find(Object.assign({ published: true, newsCategory: "Tech" }, (recentTechArticle ? { _id: { $ne: recentTechArticle._id } } : {})))
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(6);
        // Fetch articles from both World and Business categories
        const worldAndBusinessArticles = yield News_1.default.find({
            published: true,
            newsCategory: { $in: ["World", "Business"] },
        })
            .populate("user")
            .sort({ createdAt: -1 })
            .limit(6);
        res.json({
            recentArticles,
            sportsArticle,
            recentTechArticle,
            otherTechArticles,
            worldAndBusinessArticles,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching articles", error });
    }
});
exports.getMostRecentNews = getMostRecentNews;
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subcategory, type, tags, limit, order, excludeIds } = req.query;
    try {
        let query = { status: "approved", isDeleted: false };
        if (excludeIds) {
            const excluded = excludeIds
                .split(",")
                .filter((id) => mongoose_1.default.Types.ObjectId.isValid(id));
            if (excluded.length > 0) {
                query._id = { $nin: excluded };
            }
        }
        if (category)
            query.newsCategory = category;
        if (subcategory)
            query.subCategory = subcategory;
        if (type)
            query.type = type;
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        const selectedFields = "_id file video title tags name slug newsCategory subCategory liveUpdateType createdAt";
        const news = yield News_1.default.find(query)
            .select(selectedFields)
            .populate({
            path: "name",
            select: "realName stageName",
        })
            .limit(limit ? parseInt(limit, 10) : 10)
            .sort(order === "asc"
            ? { createdAt: 1 }
            : order === "desc"
                ? { createdAt: -1 }
                : undefined)
            .lean();
        // console.log("🚀 ~ news:", JSON.stringify(news, null, 2));
        res.status(200).json(news);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getNews = getNews;
const getMissedNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subcategory, type, tags, limit, order: initialOrder, missedIt, } = req.query;
    try {
        let query = { status: "approved", isDeleted: false };
        let order = initialOrder;
        // Filter by category
        if (category) {
            query.newsCategory = category;
        }
        // Filter by subcategory
        if (subcategory) {
            query.subCategory = subcategory;
        }
        // Filter by type
        if (type) {
            query.type = type;
        }
        // Filter by tags
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        if (missedIt === true) {
            const oneWeekAgo = subDays(new Date(), 7);
            const oneMonthAgo = subDays(new Date(), 30);
            query.createdAt = {
                $gte: oneMonthAgo,
                $lte: oneWeekAgo,
            };
            order = "desc";
        }
        const selectedFields = "_id file video title tags newsCategory subCategory liveUpdateType createdAt";
        let newsQuery = News_1.default.find(query)
            .select(selectedFields)
            .limit(limit ? parseInt(limit) : 10)
            .sort(order === "asc"
            ? { createdAt: 1 }
            : order === "desc"
                ? { createdAt: -1 }
                : undefined);
        const news = yield newsQuery.exec();
        res.status(200).json(news);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getMissedNews = getMissedNews;
const getNewsByTags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tags = "", limit = 10, page = 1 } = req.query;
    try {
        const tagArray = typeof tags === "string" ? tags.split(",") : [];
        if (!tagArray.length) {
            return res.status(400).json({ error: "No tags provided." });
        }
        // Pagination settings
        const pageLimit = Math.max(Number(limit), 1);
        const skip = (Number(page) - 1) * pageLimit;
        // Query the news collection
        const news = yield News_1.default.find({
            tags: { $in: tagArray },
            isDeleted: false,
        })
            .skip(skip)
            .limit(pageLimit)
            .sort({ createdAt: -1 })
            .populate("user");
        const totalNews = yield News_1.default.countDocuments({
            tags: { $in: tagArray },
            isDeleted: false,
        });
        res.json({ news, totalNews });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getNewsByTags = getNewsByTags;
const getNewsBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const article = yield News_1.default.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }).populate("user");
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }
        const relatedNews = yield News_1.default.find({
            _id: { $ne: article._id },
            tags: { $in: article.tags },
            newsCategory: article.newsCategory,
            subCategory: article.subCategory,
            status: "approved",
        })
            .limit(3)
            .select("_id file video title tags newsCategory createdAt slug");
        res.json({ article, relatedNews });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getNewsBySlug = getNewsBySlug;
const getArticlesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, subcategory, excludeIds } = req.query;
        const { type, tags, limit, order } = req.query;
        let query = { isDeleted: false };
        if (category)
            query.newsCategory = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        if (subcategory)
            query.subCategory = {
                $regex: new RegExp(`^${subcategory.trim()}$`, "i"),
            };
        if (type)
            query.type = type;
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        if (excludeIds) {
            const excluded = excludeIds
                .split(",")
                .filter((id) => mongoose_1.default.Types.ObjectId.isValid(id));
            if (excluded.length > 0) {
                query._id = { $nin: excluded };
            }
        }
        let articles = News_1.default.find(query);
        if (order) {
            articles = articles.sort({ [order]: -1 });
        }
        if (limit) {
            articles = articles.limit(parseInt(limit));
        }
        const results = yield articles;
        // console.log("🚀 ~ getArticlesByCategory ~ results:", results);
        if (!results.length) {
            return res.status(404).json({ message: "No articles found" });
        }
        res.status(200).json(results);
    }
    catch (err) {
        console.error("Error fetching articles:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
exports.getArticlesByCategory = getArticlesByCategory;
const getImageArticlesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, subcategory, excludeIds } = req.query;
        const { tags, limit, order } = req.query;
        let query = { isDeleted: false };
        // Match correct schema fields
        if (category)
            query.category = { $regex: new RegExp(`^${category}$`, "i") };
        if (subcategory)
            query.subCategory = { $regex: new RegExp(`^${subcategory}$`, "i") };
        // Ensure tags are ObjectId references
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        // Exclude specific articles by ID
        if (excludeIds) {
            query._id = { $nin: excludeIds.split(",") };
        }
        // Run query
        let articles = Image_1.default.find(query);
        // Apply sort order if provided
        if (order) {
            articles = articles.sort({ [order]: -1 });
        }
        // Apply limit if provided
        if (limit) {
            articles = articles.limit(parseInt(limit));
        }
        const results = yield articles;
        if (!results.length) {
            return res.status(404).json({ message: "No articles found" });
        }
        res.status(200).json(results);
    }
    catch (err) {
        console.error("Error fetching articles:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});
exports.getImageArticlesByCategory = getImageArticlesByCategory;
const getRelatedNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug, tags, category } = req.query;
        const tagsArray = typeof tags === "string" ? tags.split(",") : [];
        const relatedNews = yield News_1.default.find({
            slug: { $ne: slug },
            $or: [{ tags: { $in: tagsArray } }, { newsCategory: category }],
            status: "approved",
            isDeleted: false,
        })
            .limit(5)
            .select("_id file video title slug newsCategory createdAt");
        res.json({ relatedNews });
    }
    catch (error) {
        console.error("Error fetching related news:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getRelatedNews = getRelatedNews;
// In your controller file
const getNewsAndBuzz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsAndBuzz = yield News_1.default.aggregate([
            { $match: { status: "approved", isDeleted: { $ne: true } } },
            { $sample: { size: 3 } },
            {
                $project: {
                    _id: 1,
                    file: 1,
                    video: 1,
                    title: 1,
                    slug: 1,
                    newsCategory: 1,
                    createdAt: 1,
                },
            },
        ]);
        res.json({ newsAndBuzz });
    }
    catch (error) {
        console.error("Error fetching News & Buzz articles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getNewsAndBuzz = getNewsAndBuzz;
// In your controller file
const getUpNextArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        const currentArticle = yield News_1.default.findOne({ slug });
        if (!currentArticle) {
            return res.status(404).json({ message: "Article not found" });
        }
        // Fetch up to 5 articles created after the current one
        let upNextArticles = yield News_1.default.find({
            slug: { $ne: slug },
            createdAt: { $gt: currentArticle.createdAt },
            status: "approved",
            isDeleted: false,
        })
            .sort({ createdAt: 1 })
            .limit(5)
            .select("_id file video title slug createdAt newsCategory");
        const remainingCount = 5 - upNextArticles.length;
        // If less than 5 found, fill the rest with older articles
        if (remainingCount > 0) {
            const fallbackArticles = yield News_1.default.find({
                slug: { $ne: slug },
                createdAt: { $lt: currentArticle.createdAt },
                status: "approved",
                isDeleted: false,
            })
                .sort({ createdAt: -1 })
                .limit(remainingCount)
                .select("_id file video title slug createdAt newsCategory");
            upNextArticles = [...upNextArticles, ...fallbackArticles];
        }
        res.json({ upNextArticles });
    }
    catch (error) {
        console.error("Error fetching Up Next articles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUpNextArticles = getUpNextArticles;
const getMostReadArticles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mostReadArticles = yield News_1.default.find({
            published: true,
            isDeleted: false,
        })
            .sort({ views: -1 })
            .limit(10)
            .select("title slug views newsCategory createdAt");
        res.json(mostReadArticles);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch most read articles" });
    }
});
exports.getMostReadArticles = getMostReadArticles;
const getPendingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subcategory, type, status, tags, limit, order } = req.query;
    const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
    try {
        let query = { status: "pending" };
        //Filter by category
        if (category) {
            query.newsCategory = category;
        }
        //Filter by subcategory
        if (subcategory) {
            query.subCategory = subcategory;
        }
        //Filter by type
        if (type) {
            query.type = type;
        }
        //Filter by tags
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        //Filter by status
        if (status) {
            query.status = status;
        }
        const selectedFields = "_id file title slug authorName tags status newsCategory subCategory liveUpdateType createdAt";
        // Check if there are pending news articles in the database
        const pendingNewsCount = yield News_1.default.countDocuments({ status: "pending" });
        const totalPages = Math.ceil(pendingNewsCount / pageSize);
        if (pendingNewsCount === 0) {
            return res.status(404).json({ message: "No pending news found" });
        }
        let newsQuery = News_1.default.find(query)
            .select(selectedFields)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort(order === "asc"
            ? { createdAt: 1 }
            : order === "desc"
                ? { createdAt: -1 }
                : undefined);
        const news = yield newsQuery.exec();
        res.status(200).json({ news, totalPages });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getPendingNews = getPendingNews;
const getApprovedNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subcategory, type, status, tags, limit, order } = req.query;
    const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
    try {
        let query = { status: "approved" };
        //Filter by category
        if (category) {
            query.newsCategory = category;
        }
        //Filter by subcategory
        if (subcategory) {
            query.subCategory = subcategory;
        }
        //Filter by type
        if (type) {
            query.type = type;
        }
        //Filter by tags
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        //Filter by status
        if (status) {
            query.status = status;
        }
        const selectedFields = "_id file title slug authorName tags status newsCategory subCategory liveUpdateType createdAt";
        // Check if there are pending news articles in the database
        const pendingNewsCount = yield News_1.default.countDocuments({ status: "approved" });
        const totalPages = Math.ceil(pendingNewsCount / pageSize);
        if (pendingNewsCount === 0) {
            return res.status(404).json({ message: "No approved news found" });
        }
        let newsQuery = News_1.default.find(query)
            .select(selectedFields)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort(order === "asc"
            ? { createdAt: 1 }
            : order === "desc"
                ? { createdAt: -1 }
                : undefined);
        const news = yield newsQuery.exec();
        res.status(200).json({ news, totalPages });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getApprovedNews = getApprovedNews;
const getRejectedNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, subcategory, type, status, tags, limit, order } = req.query;
    const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
    try {
        let query = { status: "rejected" };
        //Filter by category
        if (category) {
            query.newsCategory = category;
        }
        //Filter by subcategory
        if (subcategory) {
            query.subCategory = subcategory;
        }
        //Filter by type
        if (type) {
            query.type = type;
        }
        //Filter by tags
        if (tags) {
            query.tags = { $in: tags.split(",") };
        }
        //Filter by status
        if (status) {
            query.status = status;
        }
        const selectedFields = "_id file title slug authorName tags status newsCategory subCategory liveUpdateType createdAt";
        // Check if there are pending news articles in the database
        const pendingNewsCount = yield News_1.default.countDocuments({ status: "rejected" });
        const totalPages = Math.ceil(pendingNewsCount / pageSize);
        if (pendingNewsCount === 0) {
            return res.status(404).json({ message: "No Rejected news found" });
        }
        let newsQuery = News_1.default.find(query)
            .select(selectedFields)
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .sort(order === "asc"
            ? { createdAt: 1 }
            : order === "desc"
                ? { createdAt: -1 }
                : undefined);
        const news = yield newsQuery.exec();
        res.status(200).json({ news, totalPages });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getRejectedNews = getRejectedNews;
const approveNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsId = req.params.id;
        const news = yield News_1.default.findByIdAndUpdate(newsId, { status: "approved" }, { new: true });
        if (!news) {
            return res.status(404).send({ message: "News not found" });
        }
        res.status(200).send({ message: "News approved successfully", news });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.approveNews = approveNews;
const rejectNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newsId = req.params.id;
        const news = yield News_1.default.findByIdAndUpdate(newsId, { status: "rejected" }, { new: true });
        if (!news) {
            return res.status(404).send({ message: "News not found" });
        }
        res.status(200).send({ message: "News rejected successfully", news });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.rejectNews = rejectNews;
// export const updateSettings = async (req: Request, res: Response) => {
//   const { userId } = req.user;
//   try {
//     const { siteTitle, siteDescription } = req.body;
//     let siteLogo = req.body.siteLogo;
//     let newCloudinaryPublicId;
//     if (!siteTitle || !siteDescription) {
//       return res
//         .status(400)
//         .send({ message: "Site title and description are required" });
//     }
//     // Fetch the current settings to get the old logo if it exists
//     const currentSettings = await Settings.findOne();
//     // Handle Cloudinary upload if a new logo is provided
//     if (req.file) {
//       // Delete the old logo from Cloudinary if it exists
//       if (currentSettings && currentSettings.public_id) {
//         await cloudinary.uploader.destroy(currentSettings.public_id);
//       }
//       // Upload the new logo to Cloudinary
//       const result = await cloudinary.uploader.upload(req.file.path, {
//         folder: "logo",
//       });
//       siteLogo = result.secure_url; // URL of the uploaded logo
//       newCloudinaryPublicId = result.public_id; // Save the public ID of the new logo
//     } else if (currentSettings) {
//       // Use the existing logo URL and public ID if no new file is provided
//       siteLogo = currentSettings.siteLogo;
//       newCloudinaryPublicId = currentSettings.public_id;
//     }
//     // Update settings in the database
//     const settings = await Settings.findOneAndUpdate(
//       {},
//       {
//         siteTitle,
//         siteDescription,
//         siteLogo,
//         public_id: newCloudinaryPublicId,
//       },
//       { new: true, upsert: true }
//     );
//     await new ActivityLog({
//       userId: userId,
//       activity: "Updated Settings",
//     }).save();
//     res
//       .status(200)
//       .send({ message: "Settings updated successfully", settings });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .send({ message: "Internal Server Error", error: error.message });
//   }
// };
// export const getSettings = async (req: Request, res: Response) => {
//   try {
//     const settings = await Settings.findOne();
//     if (!settings) {
//       return;
//     }
//     res.status(200).send(settings);
//   } catch (error) {
//     res
//       .status(500)
//       .send({ message: "Internal Server Error", error: error.message });
//   }
// };
const getAnalytics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalNews = yield News_1.default.countDocuments();
        const approvedNews = yield News_1.default.countDocuments({ status: "approved" });
        const rejectedNews = yield News_1.default.countDocuments({ status: "rejected" });
        const pendingNews = yield News_1.default.countDocuments({
            status: { $nin: ["approved", "rejected"] },
        });
        res
            .status(200)
            .send({ totalNews, approvedNews, rejectedNews, pendingNews });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.getAnalytics = getAnalytics;
const moderateComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const commentId = req.params.id;
        const action = req.body.action;
        const comment = yield Comment_1.default.findByIdAndUpdate(commentId, { status: action }, { new: true });
        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }
        res
            .status(200)
            .send({ message: `Comment ${action}d successfully`, comment });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.moderateComment = moderateComment;
const createImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!req.user || !userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const { title, caption, category, subCategory, tags, altText } = req.body;
        if (!altText || !title) {
            return res.status(400).send({ error: "Alt text and title are required" });
        }
        const imageFiles = req.body.cloudinaryUrls || [];
        if (imageFiles.length === 0) {
            return res
                .status(400)
                .json({ error: "At least one image file is required" });
        }
        const newImage = new Image_1.default({
            title,
            files: imageFiles,
            caption,
            category,
            subCategory,
            tags: Array.isArray(tags) ? tags : [tags],
            altText,
            user: userId,
        });
        const savedImage = yield newImage.save();
        res.status(201).json({
            success: true,
            message: "Images uploaded and saved successfully",
            image: savedImage,
        });
    }
    catch (error) {
        console.error("Error uploading images:", error);
        res.status(500).json({ error: "Failed to upload images" });
    }
});
exports.createImage = createImage;
// Fetch all images
const getImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let images;
        if (req.user.role === "admin") {
            // Admin can see all images
            images = yield Image_1.default.find()
                .populate("category")
                .populate("subCategory")
                .sort({ createdAt: -1 });
        }
        else {
            // Non-admin users can only see their own images
            images = yield Image_1.default.find({ user: req.user._id })
                .populate("category")
                .populate("subCategory")
                .sort({ createdAt: -1 });
        }
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
});
exports.getImages = getImages;
const getAllImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield Image_1.default.find()
            .populate("category")
            .populate("subCategory")
            .sort({ createdAt: -1 });
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
});
exports.getAllImages = getAllImages;
// Fetch images by category or tag
const getImagesByCategoryOrTag = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, subCategory, tag } = req.query;
        let filter = {};
        if (category)
            filter.category = category;
        if (subCategory)
            filter.subCategory = subCategory;
        if (tag)
            filter.tags = tag;
        const images = yield Image_1.default.find(filter)
            .populate("category")
            .populate("subCategory")
            .sort({ createdAt: -1 });
        res.status(200).json(images);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch images" });
    }
});
exports.getImagesByCategoryOrTag = getImagesByCategoryOrTag;
// Delete an image and all associated files from Cloudinary
const deleteImageByUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find the image by ID in the database
        const image = yield Image_1.default.findById(id);
        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }
        // Delete each image in the files array using its public_id
        const deleteResults = yield Promise.all(image.files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            console.log("Deleting image with public_id:", file.public_id);
            const result = yield cloud_1.cloudinary.uploader.destroy(file.public_id);
            if (result.result !== "ok") {
                console.error(`Failed to delete image: ${file.public_id}`, result);
                return result;
            }
            return result;
        })));
        const failedDeletions = deleteResults.filter((result) => result.result !== "ok");
        if (failedDeletions.length > 0) {
            return res
                .status(500)
                .json({ error: "Failed to delete some images from Cloudinary" });
        }
        // Remove the image document from MongoDB
        yield Image_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            message: "All images and the associated image document deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting image:", error);
        return res.status(500).json({ error: error.message });
    }
});
exports.deleteImageByUser = deleteImageByUser;
// get all images by admin
const images = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const images = yield Image_1.default.find()
            .skip((page - 1) * limit)
            .limit(limit);
        const totalImages = yield Image_1.default.countDocuments();
        res.json({
            images,
            totalPages: Math.ceil(totalImages / limit),
            currentPage: page,
        });
    }
    catch (error) {
        res
            .status(500)
            .send({ message: "Internal Server Error", error: error.message });
    }
});
exports.images = images;
const getSingleImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield Image_1.default.findById(req.params.id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        res.status(200).json({ image });
    }
    catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ message: "Failed to fetch image details" });
    }
});
exports.getSingleImage = getSingleImage;
const getDeletedNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
        const pageSize = parseInt(typeof req.query.pageSize === "string" ? req.query.pageSize : "5") || 5;
        const userId = req.user._id;
        const options = {
            page: page,
            limit: pageSize,
            sort: { createdAt: -1 },
        };
        const query = { user: userId, isDeleted: true };
        const paginatedNews = yield News_1.default.paginate(query, options);
        res.json({
            news: paginatedNews.docs,
            totalPages: paginatedNews.totalPages,
        });
    }
    catch (error) {
        console.error("Error fetching deleted news:", error);
        throw new Error("Failed to fetch deleted news");
    }
});
exports.getDeletedNews = getDeletedNews;
const mainSearch = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = parseInt(req.query.page) || 1;
            const pageSize = parseInt(req.query.pageSize) || 10;
            const searchText = req.query.q;
            const query = {
                $or: [
                    { title: { $regex: searchText, $options: "i" } },
                    { tags: { $regex: searchText, $options: "i" } },
                    { newsCategory: { $regex: searchText, $options: "i" } },
                    { subCategory: { $regex: searchText, $options: "i" } },
                    { authorName: { $regex: searchText, $options: "i" } },
                ],
                isDeleted: false,
            };
            const options = {
                page: page,
                limit: pageSize,
                sort: { createdAt: -1 },
            };
            const totalResults = yield News_1.default.countDocuments(query);
            const paginatedNews = yield News_1.default.paginate(query, options);
            res.json({
                news: paginatedNews.docs,
                totalPages: Math.ceil(totalResults / pageSize),
                currentPage: page,
            });
        }
        catch (error) {
            console.error("Error in main search:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
};
exports.mainSearch = mainSearch;
const getOldestNewsArticleByType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveUpdateType } = req.query;
    const query = liveUpdateType ? { liveUpdateType } : {};
    try {
        const oldestNewsArticle = yield News_1.default.findOne(query)
            .sort({ createdAt: 1 })
            .populate("user");
        if (oldestNewsArticle) {
            res.status(200).json(oldestNewsArticle);
        }
        else {
            res.status(404).json({ message: "No live updates found for this type" });
        }
    }
    catch (error) {
        console.error("Error fetching oldest live update:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getOldestNewsArticleByType = getOldestNewsArticleByType;
const getNewsByLiveUpdateType = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { liveUpdateType } = req.query;
    const query = liveUpdateType ? { liveUpdateType, isLiveUpdate: true } : {};
    try {
        const newsArticles = yield News_1.default.find(query)
            .sort({ createdAt: -1 })
            .populate("user");
        if (newsArticles.length > 0) {
            res.status(200).json(newsArticles);
        }
        else {
            res.status(404).json({ message: "No live updates found for this type" });
        }
    }
    catch (error) {
        console.error("Error fetching live updates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getNewsByLiveUpdateType = getNewsByLiveUpdateType;
const getAllLiveUpdates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const liveUpdates = yield News_1.default.find({ isLiveUpdate: true })
            .sort({ createdAt: -1 })
            .populate("user");
        if (liveUpdates.length > 0) {
            res.status(200).json(liveUpdates);
        }
        else {
            res.status(404).json({ message: "No live updates found" });
        }
    }
    catch (error) {
        console.error("Error fetching live updates:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllLiveUpdates = getAllLiveUpdates;
