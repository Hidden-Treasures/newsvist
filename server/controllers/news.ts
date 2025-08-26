import { Request, Response } from "express";
import { sendError } from "../utils/helper";
import News from "../models/News";
import bcrypt from "bcryptjs";
import Biography from "../models/Biography";
import Subscription from "../models/Subscription";
import Type from "../models/Type";
import Category from "../models/Category";
import SubCategory from "../models/Subcategory";
import mongoose from "mongoose";
import User from "../models/User";
import { FileObject, GetNewsQuery, NewsQuery } from "../types";
import Media from "../models/Media";
import Comment from "../models/Comment";
import slugify from "slugify";
import { cloudinary } from "../cloud";
import LiveEvent from "../models/LiveEvent";
import io from "../server";
import LiveUpdateEntry from "../models/LiveUpdateEntry";
import { hasRecentView } from "../lib/inmemory";
import redisClient from "../lib/redis";
import Notifications from "../models/Notifications";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

async function generateUniqueSlug(title: string): Promise<string> {
  const { nanoid } = await import("nanoid");
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let exists = await News.findOne({ slug });

  while (exists) {
    const suffix = nanoid(4);
    slug = `${baseSlug}-${suffix}`;
    exists = await News.findOne({ slug });
  }

  return slug;
}
const { isValidObjectId } = require("mongoose");
const { subDays } = require("date-fns");
const webpush = require("web-push");

// Your VAPID keys from web-push setup
webpush.setVapidDetails(
  "mailto:newsvist@gmail.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export const videoUpload = async (req: Request, res: Response) => {
  try {
    if (!req.body.cloudinaryUrls || req.body.cloudinaryUrls.length === 0) {
      return res.status(400).json({ error: "Video upload failed" });
    }

    const { url, public_id } = req.body.cloudinaryUrls[0];

    res.status(201).json({ url, public_id });
  } catch (error) {
    console.error("Error in video upload:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getLastFiveLiveUpdateNewsType = async function (
  req: Request,
  res: Response
) {
  try {
    const lastFiveLiveUpdates = await News.find({ isLiveUpdate: true })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(lastFiveLiveUpdates);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;
    const role = (req.user as any)?.role;

    const isAdmin = role === "admin";
    const isEditor = role === "editor";

    const {
      title,
      newsCategory,
      subCategory,
      type,
      tags,
      editorText,
      video,
      city,
      name,
      isAdvertisement,
      publishDate,
      isDraft,
    } = req.body;

    // Get bio id if name is provided
    let bioId = null;
    if (name) {
      const bio = await Biography.findOne({
        stageName: new RegExp(`^${name}$`, "i"),
      });
      if (bio) bioId = bio._id;
    }

    const slug = await generateUniqueSlug(title);

    const newNews = new News({
      title,
      slug,
      newsCategory,
      subCategory,
      type,
      tags: Array.isArray(tags) ? tags : [tags],
      editorText,
      author: userId,
      city,
      video,
      name: bioId,
      isAdvertisement,
    });

    // Determine publishing status
    if (isAdmin || isEditor) {
      // Admins and editors: publish immediately
      newNews.status = "approved";
      newNews.published = true;
      newNews.publishedAt = new Date();
    } else {
      // Journalists: may schedule or save as draft
      if (!isDraft && publishDate && new Date(publishDate) > new Date()) {
        newNews.status = "scheduled";
        newNews.published = false;
        newNews.publishedAt = new Date(publishDate);
      } else if (!isDraft) {
        newNews.status = "pending";
        newNews.published = false;
      } else {
        newNews.status = "draft";
        newNews.published = false;
      }
    }

    // uploading Image file
    if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
      const cloudinaryUrls: FileObject[] = req.body.cloudinaryUrls;

      const videoFile = cloudinaryUrls.find((file) =>
        file.url.match(/\.mp4|\.mov|\.avi$/i)
      );
      const imageFiles = cloudinaryUrls.filter((file) =>
        file.url.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)
      );

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

    await newNews.save();

    // Notify admin/editor if journalist created news
    if (role === "journalist") {
      const recipients = await User.find({
        role: { $in: ["admin", "editor"] },
      }).select("_id");

      const notifications = recipients.map((recipient) => ({
        user: recipient._id,
        message: `New article submitted by journalist: "${newNews.title}"`,
        type: "article",
      }));

      if (notifications.length > 0) {
        await Notifications.insertMany(notifications);
      }
    }

    // Push notifications
    const baseUrl = "https://www.newsvist.com";
    const dateObj = newNews.createdAt;
    const articleUrl = `${baseUrl}/${dateObj.getFullYear()}/${String(
      dateObj.getMonth() + 1
    ).padStart(2, "0")}/${String(dateObj.getDate()).padStart(2, "0")}/${
      newNews.newsCategory
    }/${newNews.slug}`;

    const payload = JSON.stringify({
      title: `NewsVist: ${newNews.newsCategory || "News"}`,
      body: `New: "${newNews.title}". Tap to read.`,
      url: articleUrl,
      image: newNews.file?.url || newNews.images?.[0] || undefined,
    });

    let query: Record<string, any> = {
      $or: [
        { categories: { $exists: false } },
        { categories: { $size: 0 } },
        { categories: newNews.newsCategory },
      ],
    };
    if (newNews.type === "BreakingNews") query = {};

    const subscriptions = await Subscription.find(query);
    subscriptions.forEach((subDoc) => {
      const subscription = subDoc.toObject();
      webpush
        .sendNotification(subscription, payload, { TTL: 60 })
        .catch(async (err: any) => {
          if (err.statusCode === 404 || err.statusCode === 410) {
            console.log(
              "Removing expired subscription:",
              subscription.endpoint
            );
            await Subscription.deleteOne({ endpoint: subscription.endpoint });
          } else {
            console.error("Push error:", err);
          }
        });
    });

    res.status(201).json({ news: { id: newNews._id, title } });
  } catch (err) {
    console.error("Error saving news:", err);
    res.status(500).json({ error: "Failed to save news" });
  }
};

// LIVE UPDATES
export const createLiveEvent = async (req: Request, res: Response) => {
  try {
    const { liveUpdateType, headline } = req.body;

    if (!liveUpdateType || !headline) {
      return res
        .status(400)
        .json({ error: "liveUpdateType and headline are required" });
    }

    const event = await LiveEvent.create({ liveUpdateType, headline });
    res.status(201).json(event);
  } catch (error: any) {
    console.error("Error creating live event:", error);
    res.status(500).json({ error: "Failed to create live event" });
  }
};
export const addLiveUpdateEntry = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    const { title, content } = req.body;
    const userId = (req.user as any)?._id;

    const event = await LiveEvent.findOne({ liveUpdateType: type });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const newEntry = new LiveUpdateEntry({
      event: event._id,
      title,
      content,
      author: userId,
    });

    // uploading Image file
    if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
      const cloudinaryUrls: FileObject[] = req.body.cloudinaryUrls;

      const videoFile = cloudinaryUrls.find((file) =>
        file.url.match(/\.mp4|\.mov|\.avi$/i)
      );
      const imageFiles = cloudinaryUrls.filter((file) =>
        file.url.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)
      );

      if (videoFile) {
        newEntry.video = { url: videoFile.url, public_id: videoFile.public_id };
      }

      if (imageFiles.length > 0) {
        newEntry.file = {
          url: imageFiles[0].url,
          public_id: imageFiles[0].public_id,
          responsive: imageFiles[0].responsive || [],
        };
      }
    }
    await newEntry.save();

    // 🔥 emit new entry to all clients subscribed to this event
    io.to(type).emit("new-entry", newEntry);

    res.status(201).json(newEntry);
  } catch (error: any) {
    console.error("Error adding live update entry:", error);
    res.status(500).json({ error: "Failed to add entry" });
  }
};

export const getLiveEventEntries = async (req: Request, res: Response) => {
  try {
    const { type } = req.params;

    const event = await LiveEvent.findOne({ liveUpdateType: type });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const entries = await LiveUpdateEntry.find({ event: event._id })
      .sort({
        createdAt: -1,
      })
      .populate("event")
      .populate("author", "username profilePhoto");

    res.json({ event, entries });
  } catch (error: any) {
    console.error("Error fetching live event:", error);
    res.status(500).json({ error: "Failed to fetch event entries" });
  }
};
export const getAllLiveEvents = async (req: Request, res: Response) => {
  try {
    const events = await LiveEvent.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error: any) {
    console.error("Error fetching live events:", error);
    res.status(500).json({ error: "Failed to fetch live events" });
  }
};

export const getAdvertisements = async (req: Request, res: Response) => {
  try {
    const ads = await News.find({ isAdvertisement: true, published: true })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(ads);
  } catch (err) {
    console.error("Error fetching ads:", err);
    res.status(500).json({ error: "Failed to fetch advertisements" });
  }
};

export const addType = async function (req: Request, res: Response) {
  const { name } = req.body;
  try {
    if (name) {
      const newType = new Type({ name });
      const savedType = await newType.save();

      res.status(201).json(savedType);
    } else {
      res.status(500).json("Type not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

export const deleteType = async (req: Request, res: Response) => {
  const { typeId } = req.params;
  try {
    await Type.findByIdAndDelete(typeId);
    res.json({ message: "Type deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
export const getNewsType = async function (req: Request, res: Response) {
  try {
    const allTypes = await Type.find();
    res.json(allTypes);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

export const getAllNewsCategories = async function (
  req: Request,
  res: Response
) {
  try {
    const categories = await Category.find({}, "title");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

export const getAllNewsSubCategories = async function (
  req: Request,
  res: Response
) {
  const selectedCategory = req.params.catName;
  try {
    const category = await Category.findOne({
      title: selectedCategory,
    }).populate("items");
    if (!category) {
      return res.status(404).json({ error: "Category Not Found." });
    }

    res.json(category.items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error. " });
  }
};

export const newsList = async function (req: Request, res: Response) {
  try {
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize =
      parseInt(
        typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
      ) || 5;
    const userId = (req.user as any)?._id;
    const role = (req.user as any)?.role;
    const isAdmin = role === "admin";

    const query = isAdmin
      ? { isDeleted: false }
      : { author: userId, isDeleted: false };

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
      populate: [
        {
          path: "author",
          select: "username email",
        },
      ],
    };

    const paginatedNews = await News.paginate(query, options);
    res.json({
      news: paginatedNews.docs,
      totalPages: paginatedNews.totalPages,
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allNewsList = async function (req: Request, res: Response) {
  try {
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize =
      parseInt(
        typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
      ) || 5;
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

    const paginatedNews = await News.paginate(query, options);
    res.json({
      news: paginatedNews.docs,
      totalPages: paginatedNews.totalPages,
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editorNewsList = async function (req: Request, res: Response) {
  try {
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize =
      parseInt(
        typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
      ) || 5;

    const userId = (req.user as any)._id;
    const role = (req.user as any)?.role;

    let query: any = { isDeleted: false };

    if (role === "editor") {
      query = {
        isDeleted: false,
        $or: [{ author: userId }, { editor: userId }],
      };
    } else if (role !== "admin") {
      query = { author: userId, isDeleted: false };
    }
    const options = {
      page,
      limit: pageSize,
      sort: { createdAt: -1 },
      populate: [
        {
          path: "author",
          select: "username email",
        },
        {
          path: "editor",
          select: "username email",
        },
      ],
    };

    const paginatedNews = await News.paginate(query, options);

    res.json({
      news: paginatedNews.docs,
      totalPages: paginatedNews.totalPages,
      currentPage: paginatedNews.page,
      totalDocs: paginatedNews.totalDocs,
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const writerNewsList = async function (req: Request, res: Response) {
  try {
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize =
      parseInt(
        typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
      ) || 5;
    const writer = req.user._id;

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
    };

    const query = { editor: writer, isDeleted: false };

    const paginatedNews = await News.paginate(query, options);
    res.json({
      news: paginatedNews.docs,
      totalPages: paginatedNews.totalPages,
    });
  } catch (error) {
    console.error("Error fetching news data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const totalNewsStats = async (req: Request, res: Response) => {
  try {
    // Aggregate articles trend (last 14 days)
    const trend = await News.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
          v: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthTrend = trend.map((t) => ({ d: t._id, v: t.v }));

    // Count stats
    const totalArticles = await News.countDocuments({ isDeleted: false });
    const drafts = await News.countDocuments({
      status: "draft",
      isDeleted: false,
    });
    const reported = await News.countDocuments({
      status: "rejected",
      isDeleted: false,
    });

    const liveEvents = await LiveUpdateEntry.countDocuments();

    res.json({
      success: true,
      stats: {
        totalArticles,
        drafts,
        reported,
        liveEvents,
        monthTrend,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch dashboard stats" });
  }
};

export const editorNewsStats = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)._id;
    const role = (req.user as any)?.role;

    // Base filter: non-deleted articles
    let filter: any = { isDeleted: false };

    if (role === "editor") {
      // Editor sees news they authored OR edited
      filter.$or = [{ author: userId }, { editor: userId }];
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13);

    // Aggregate article trends (last 14 days)
    const trend = await News.aggregate([
      {
        $match: {
          ...filter,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthTrend = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      const dateStr = d.toISOString().split("T")[0];
      const found = trend.find((t) => t._id === dateStr);
      return {
        d: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        v: found ? found.count : 0,
      };
    });

    // Count overall stats
    const [totalArticles, drafts, reported, liveEvents] = await Promise.all([
      News.countDocuments(filter),
      News.countDocuments({ ...filter, status: "draft" }),
      News.countDocuments({ ...filter, status: "rejected" }),
      LiveUpdateEntry.countDocuments(
        role === "editor" ? { editor: userId } : {}
      ),
    ]);

    res.json({
      success: true,
      stats: {
        totalArticles,
        drafts,
        reported,
        liveEvents,
        monthTrend,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

export const recentArticles = async (req: Request, res: Response) => {
  try {
    const articles = await News.find({ isDeleted: false })
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = articles.map((a) => ({
      id: a._id,
      title: a.title,
      author: (a as any).author?.username || "Unknown",
      category: a.newsCategory || "General",
      status: a.published
        ? "Published"
        : a.status === "pending"
        ? "Draft"
        : "Rejected",
      createdAt: a.createdAt.toLocaleDateString(),
      views: a.views,
    }));

    res.json({ success: true, articles: formatted });
  } catch (err) {
    console.error("Recent articles error:", err);
    res.status(500).json({ success: false });
  }
};

export const editorRecentArticles = async (req: Request, res: Response) => {
  try {
    const filter: any = { isDeleted: false };

    // If the user is an editor, only show their own articles
    if (req.user.role === "editor") {
      filter.editor = req.user._id;
    }

    const articles = await News.find(filter)
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(5);

    const formatted = articles.map((a) => ({
      id: a._id,
      title: a.title,
      author: (a as any).author?.username || "Unknown",
      category: a.newsCategory || "General",
      status: a.published
        ? "Published"
        : a.status === "pending"
        ? "Draft"
        : "Rejected",
      createdAt: a.createdAt.toLocaleDateString(),
      views: a.views,
    }));

    res.json({ success: true, articles: formatted });
  } catch (err) {
    console.error("Recent articles error:", err);
    res.status(500).json({ success: false });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  const { newsId } = req.params;
  const userId = (req.user as any)?._id;

  if (!isValidObjectId(newsId)) return sendError(res, "Invalid News ID!");

  const news = await News.findById(newsId);
  if (!news) return sendError(res, "News Not Found!", 404);

  const {
    title,
    editorText,
    newsCategory,
    subCategory,
    type,
    tags,
    city,
    video,
    name,
  } = req.body;
  const slug = await generateUniqueSlug(title);

  news.title = title;
  news.slug = slug;
  news.editorText = editorText;
  news.tags = Array.isArray(tags) ? tags : [tags];
  news.newsCategory = newsCategory;
  news.subCategory = subCategory;
  news.type = type;
  news.video = video;
  news.city = city;
  if (news.author?.toString() !== userId.toString()) {
    news.editor = userId;
  }

  if (name) {
    const bio = await Biography.findOne({ stageName: name });
    if (!bio) {
      return sendError(res, "Person not found in the Bio collection", 404);
    }
    news.name = bio._id as mongoose.Types.ObjectId;
  }

  if (req.body.cloudinaryUrls && req.body.cloudinaryUrls.length > 0) {
    const cloudinaryUrls: FileObject[] = req.body.cloudinaryUrls;
    const videoFile = cloudinaryUrls.find((file) =>
      file.url.match(/\.mp4|\.mov|\.avi$/i)
    );

    const imageFiles = cloudinaryUrls.filter((file) =>
      file.url.match(/\.jpg|\.jpeg|\.png$/i)
    );

    // Delete existing video if new video is provided
    if (videoFile && news.video?.public_id) {
      const { result } = await cloudinary.uploader.destroy(
        news.video.public_id,
        {
          resource_type: "video",
        }
      );
      if (result !== "ok") {
        return sendError(res, "Could not delete existing video!");
      }
    }
    if (videoFile) {
      news.video = { url: videoFile.url, public_id: videoFile.public_id };
    }

    // Delete existing image if new images are provided
    if (imageFiles.length > 0) {
      // Delete existing images
      if (news.file?.public_id) {
        await cloudinary.uploader.destroy(news.file.public_id);
      }

      if (news.images && news.images.length > 0) {
        for (const imgUrl of news.images) {
          // Extract public_id from URL or keep a mapping in DB
          const publicId = imgUrl.split("/").pop()?.split(".")[0];
          if (publicId) await cloudinary.uploader.destroy(publicId);
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

  await news.save();

  res.json({
    message: "News is updated",
    news: {
      id: news._id,
      title: news.title,
      file: news.file?.url,
      newsCategory: news.newsCategory,
      type: news.type,
      name: news.name,
      author: news.author,
      editor: news.editor,
    },
  });
};

export const getNewsForUpdate = async (req: Request, res: Response) => {
  const { newsId } = req.params;
  const editorId = (req.user as any)._id;

  if (!isValidObjectId(newsId)) return sendError(res, "Id is invalid!");

  const news = await News.findById(newsId).populate("editor").populate({
    path: "name",
    select: "stageName realName",
  });

  if (!news) {
    return sendError(res, "News Not Found!", 404);
  }
  res.json({
    news: {
      id: news._id,
      title: news.title,
      editorText: news.editorText,
      file: news.file?.url,
      video: news.video?.url,
      newsCategory: news.newsCategory,
      subCategory: news.subCategory,
      type: news.type,
      tags: news.tags,
      author: news.author,
      editor: editorId,
      name: news.name,
    },
  });
};

export const getNewsById = async function (req: Request, res: Response) {
  const articleId = req.params.id;
  try {
    // Find the news document by id
    const news = await News.findById(articleId);
    // Return the news data
    res.send(news);
  } catch (error) {
    // Handle error
    console.error(error);
    throw error;
  }
};

export const addToNewsRecycleBin = async (req: Request, res: Response) => {
  const { newsId } = req.params;

  if (!isValidObjectId(newsId)) return sendError(res, "Invalid News ID!");

  const news = await News.findById(newsId);
  if (!news) return sendError(res, "News Not Found!", 404);

  news.isDeleted = true;
  news.deletedAt = new Date();
  await news.save();
  res.json({ message: "News moved to Recycle Bin successfully." });
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { newsId } = req.params;
    if (!isValidObjectId(newsId)) return sendError(res, "Invalid News ID!");

    const news = await News.findById(newsId);
    if (!news) return sendError(res, "News Not Found!", 404);

    if (news.file?.public_id) {
      const { result } = await cloudinary.uploader.destroy(news.file.public_id);
      if (result !== "ok" && result !== "not found") {
        console.error("Image deletion failed:", result);
      }
    }

    if (news.video?.public_id) {
      const { result } = await cloudinary.uploader.destroy(
        news.video.public_id,
        {
          resource_type: "video",
        }
      );
      if (result !== "ok" && result !== "not found") {
        console.error("Video deletion failed:", result);
      }
    }

    await News.findByIdAndDelete(newsId);
    res.json({ message: "News removed successfully." });
  } catch (err) {
    console.error("Error deleting news:", err);
    sendError(res, "Something went wrong while deleting news!", 500);
  }
};

export const restoreNews = async (req: Request, res: Response) => {
  const { newsId } = req.params;

  if (!isValidObjectId(newsId)) return sendError(res, "Invalid News ID!");

  const news = await News.findById(newsId);
  if (!news || !news.isDeleted)
    return sendError(res, "News not found or not deleted.", 404);

  news.isDeleted = false;
  await news.save();

  res.json({ message: "News restored successfully." });
};

export const AllCategoriesWithSubCategory = async (
  req: Request,
  res: Response
) => {
  try {
    const categories = await Category.find().populate("items", "name");
    res.status(200).json(categories);
  } catch (error: any) {
    console.error("Error getting categories:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    await Category.findByIdAndDelete(categoryId);

    res.json({ message: "Category deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteSubCategory = async (req: Request, res: Response) => {
  const { categoryId, subCategoryId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    category.items.pull(subCategoryId);
    await category.save();
    // Delete the subcategory document
    await SubCategory.findByIdAndDelete(subCategoryId);

    res.json({ message: "Subcategory deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  const { name, subcategories, parentCategory } = req.body;
  try {
    if (!subcategories || subcategories.length === 0) {
      const newCategory = new Category({ title: name });
      const savedCategory = await newCategory.save();
      return res.status(201).json(savedCategory);
    } else {
      // Find parent
      const category = await Category.findById(parentCategory);
      if (!category) {
        return res.status(404).json({
          status: false,
          message: "Parent category not found",
        });
      }

      const [subcategoryName] = subcategories;

      // Create new subcategory
      const newSubCategory = new SubCategory({ name: subcategoryName });
      const savedSubCategory = await newSubCategory.save();

      category.items.push(savedSubCategory._id);

      const savedCategory = await category.save();

      return res.status(201).json(savedCategory);
    }
  } catch (error: any) {
    console.error("Error adding category:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error" });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { categoryName } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { title: categoryName },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Error updating category" });
  }
};
export const updateSubCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId, subcategoryId } = req.params;
    const { subcategoryName } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Check if subcategoryId exists in category.items
    if (!category.items.includes(new mongoose.Types.ObjectId(subcategoryId))) {
      return res
        .status(404)
        .json({ error: "Subcategory not found in this category" });
    }

    const subcategory = await SubCategory.findByIdAndUpdate(
      subcategoryId,
      { name: subcategoryName },
      { new: true }
    );

    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    res.json({
      success: true,
      message: "Subcategory updated successfully",
      data: subcategory,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating subcategory" });
  }
};

export const assignRole = async function (req: Request, res: Response) {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's role
    user.role = role;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Role assigned successfully" });
  } catch (error: any) {
    console.error("Error assigning role:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const users = async function (req: Request, res: Response) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUsersManually = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserData = async (req: Request, res: Response) => {
  const userId = req.params.userid;
  const { username, phone, email, password, confirmPassword, bio, role } =
    req.body;
  try {
    // Find the user by ID
    const user = await User.findById(userId);

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
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user document
    await user.save();

    // Respond with success message or updated user data
    res
      .status(200)
      .json({ message: "User updated successfully", user: user.toObject() });
  } catch (error: any) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserbyID = async (req: Request, res: Response) => {
  const userId = req.params.userid;
  console.log("userID for user is:", userId);
  try {
    // Find a user by the provided user ID
    const user = await User.findOne({ _id: userId });

    if (!user) {
      // Handle the case where the user is not found
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user data
    return res.json(user);
  } catch (error: any) {
    // Handle errors
    console.error("Error fetching user data:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

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

export const getHeadLine = async function (req: Request, res: Response) {
  const { liveUpdateType } = req.params;
  try {
    const lastLiveUpdate = await News.findOne({
      liveUpdateType: liveUpdateType,
      isLiveUpdate: true,
    }).sort({ createdAt: -1 });
    if (lastLiveUpdate) {
      res.json({ title: lastLiveUpdate.liveUpdateHeadline });
    } else {
      res.status(404).json({ error: "Live update not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMostRecentNews = async (req: Request, res: Response) => {
  try {
    // Fetch the most recent articles
    const recentArticles = await News.find({ published: true })
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(6);

    // Fetch the most recent sports article in the Football subcategory
    const sportsArticle = await News.findOne({
      published: true,
      newsCategory: "Sports",
      subCategory: "Football",
    })
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch the most recent tech article and 5 other tech articles
    const recentTechArticle = await News.findOne({
      published: true,
      newsCategory: "Tech",
    })
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(1);

    const otherTechArticles = await News.find({
      published: true,
      newsCategory: "Tech",
      ...(recentTechArticle ? { _id: { $ne: recentTechArticle._id } } : {}),
    })
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(6);
    // Fetch articles from both World and Business categories
    const worldAndBusinessArticles = await News.find({
      published: true,
      newsCategory: { $in: ["World", "Business"] },
    })
      .populate("author")
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      recentArticles,
      sportsArticle,
      recentTechArticle,
      otherTechArticles,
      worldAndBusinessArticles,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

export const getNews = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  const { category, subcategory, type, tags, limit, order, excludeIds } =
    req.query;
  try {
    let query: NewsQuery = { status: "approved", isDeleted: false };

    if (excludeIds) {
      const excluded = excludeIds
        .split(",")
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (excluded.length > 0) {
        query._id = { $nin: excluded };
      }
    }

    if (category)
      query.newsCategory = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    if (subcategory)
      query.subCategory = {
        $regex: new RegExp(`^${subcategory.trim()}$`, "i"),
      };

    if (type) query.type = type;
    if (tags) {
      (query as any).tags = { $in: (tags as string).split(",") };
    }

    const selectedFields =
      "_id file video title tags name slug newsCategory subCategory liveUpdateType createdAt";

    const news = await News.find(query)
      .select(selectedFields)
      .populate({
        path: "name",
        select: "realName stageName",
      })
      .limit(limit ? parseInt(limit as string, 10) : 10)
      .sort(
        order === "asc"
          ? { createdAt: 1 }
          : order === "desc"
          ? { createdAt: -1 }
          : undefined
      )
      .lean();

    // console.log("🚀 ~ news:", JSON.stringify(news, null, 2));
    res.status(200).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMissedNews = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  const {
    category,
    subcategory,
    type,
    tags,
    limit,
    order: initialOrder,
    missedIt,
  } = req.query;

  try {
    let query: NewsQuery = { status: "approved", isDeleted: false };
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
      (query as any).tags = { $in: (tags as string).split(",") };
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

    const selectedFields =
      "_id file video title tags newsCategory subCategory liveUpdateType createdAt";

    let newsQuery = News.find(query)
      .select(selectedFields)
      .limit(limit ? parseInt(limit) : 10)
      .sort(
        order === "asc"
          ? { createdAt: 1 }
          : order === "desc"
          ? { createdAt: -1 }
          : undefined
      );

    const news = await newsQuery.exec();
    res.status(200).json(news);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNewsByTags = async (req: Request, res: Response) => {
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
    const news = await News.find({
      tags: { $in: tagArray },
      isDeleted: false,
    })
      .skip(skip)
      .limit(pageLimit)
      .sort({ createdAt: -1 })
      .populate("author");

    const totalNews = await News.countDocuments({
      tags: { $in: tagArray },
      isDeleted: false,
    });

    res.json({ news, totalNews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;

    // 1. Find article without increment first
    const article = await News.findOne({ slug }).populate("author");
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // 2. Prevent bots
    const userAgent = req.headers["user-agent"] || "";
    if (!/bot|crawler|spider|crawling/i.test(userAgent)) {
      const userId = (req as any).user?._id;
      const ip =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "unknown";

      const dedupeKey = `view:${article._id}:${userId || ip}`;

      let alreadyViewed = false;

      if (redisClient) {
        try {
          alreadyViewed = !!(await redisClient.get(dedupeKey));
          if (!alreadyViewed) {
            await News.updateOne({ _id: article._id }, { $inc: { views: 1 } });
            await redisClient.set(dedupeKey, "1", "EX", 300);
            article.views += 1;
          }
        } catch (err) {
          console.error("Redis error, falling back to in-memory:", err);
          alreadyViewed = hasRecentView(dedupeKey);
          if (!alreadyViewed) {
            await News.updateOne({ _id: article._id }, { $inc: { views: 1 } });
            article.views += 1;
          }
        }
      } else {
        // No Redis configured → use fallback
        alreadyViewed = hasRecentView(dedupeKey);
        if (!alreadyViewed) {
          await News.updateOne({ _id: article._id }, { $inc: { views: 1 } });
          article.views += 1;
        }
      }
    }

    // 3. Fetch related news
    const relatedNews = await News.find({
      _id: { $ne: article._id },
      tags: { $in: article.tags },
      newsCategory: article.newsCategory,
      subCategory: article.subCategory,
      status: "approved",
    })
      .limit(3)
      .select("_id file video title tags newsCategory createdAt slug");

    res.json({ article, relatedNews });
  } catch (error) {
    console.error("getNewsBySlug error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getArticlesByCategory = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  try {
    const { category, subcategory, excludeIds } = req.query;
    const { type, tags, limit, order } = req.query;

    let query: NewsQuery = { isDeleted: false };

    if (category)
      query.newsCategory = { $regex: new RegExp(`^${category.trim()}$`, "i") };
    if (subcategory)
      query.subCategory = {
        $regex: new RegExp(`^${subcategory.trim()}$`, "i"),
      };

    if (type) query.type = type;
    if (tags) {
      (query as any).tags = { $in: (tags as string).split(",") };
    }
    if (excludeIds) {
      const excluded = excludeIds
        .split(",")
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (excluded.length > 0) {
        query._id = { $nin: excluded };
      }
    }

    let articles = News.find(query);

    if (order) {
      articles = articles.sort({ [order]: -1 });
    }

    if (limit) {
      articles = articles.limit(parseInt(limit));
    }

    const results = await articles;
    // console.log("🚀 ~ getArticlesByCategory ~ results:", results);

    if (!results.length) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.status(200).json(results);
  } catch (err: any) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getMediaArticlesByCategory = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  try {
    const { category, subcategory, excludeIds } = req.query;
    const { tags, limit, order } = req.query;

    let query: NewsQuery = { isDeleted: false };

    // Match correct schema fields
    if (category) query.category = { $regex: new RegExp(`^${category}$`, "i") };
    if (subcategory)
      query.subCategory = { $regex: new RegExp(`^${subcategory}$`, "i") };

    // Ensure tags are ObjectId references
    if (tags) {
      (query as any).tags = { $in: (tags as string).split(",") };
    }

    // Exclude specific articles by ID
    if (excludeIds) {
      query._id = { $nin: excludeIds.split(",") };
    }

    // Run query
    let articles = Media.find(query);

    // Apply sort order if provided
    if (order) {
      articles = articles.sort({ [order]: -1 });
    }

    // Apply limit if provided
    if (limit) {
      articles = articles.limit(parseInt(limit));
    }

    const results = await articles;

    if (!results.length) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.status(200).json(results);
  } catch (err: any) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getRelatedNews = async (req: Request, res: Response) => {
  try {
    const { slug, tags, category } = req.query;

    const tagsArray = typeof tags === "string" ? tags.split(",") : [];

    const relatedNews = await News.find({
      slug: { $ne: slug },
      $or: [{ tags: { $in: tagsArray } }, { newsCategory: category }],
      status: "approved",
      isDeleted: false,
    })
      .limit(5)
      .select("_id file video title slug newsCategory createdAt");

    res.json({ relatedNews });
  } catch (error) {
    console.error("Error fetching related news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// In your controller file

export const getNewsAndBuzz = async (req: Request, res: Response) => {
  try {
    const newsAndBuzz = await News.aggregate([
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
  } catch (error) {
    console.error("Error fetching News & Buzz articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// In your controller file

export const getUpNextArticles = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const currentArticle = await News.findOne({ slug });

    if (!currentArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    // Fetch up to 5 articles created after the current one
    let upNextArticles = await News.find({
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
      const fallbackArticles = await News.find({
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
  } catch (error) {
    console.error("Error fetching Up Next articles:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMostReadArticles = async (req: Request, res: Response) => {
  try {
    const mostReadArticles = await News.find({
      published: true,
      isDeleted: false,
    })
      .sort({ views: -1 })
      .limit(10)
      .select("title slug views newsCategory createdAt");
    res.json(mostReadArticles);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch most read articles" });
  }
};

export const getPendingNews = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  const { category, subcategory, type, status, tags, limit, order } = req.query;
  const page =
    parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
  const pageSize =
    parseInt(
      typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
    ) || 5;
  try {
    let query: NewsQuery = { status: "pending" };
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
      (query as any).tags = { $in: (tags as string).split(",") };
    }
    //Filter by status
    if (status) {
      query.status = status;
    }
    const selectedFields =
      "_id file title slug author tags status newsCategory subCategory liveUpdateType createdAt";

    // Check if there are pending news articles in the database
    const pendingNewsCount = await News.countDocuments({ status: "pending" });
    const totalPages = Math.ceil(pendingNewsCount / pageSize);
    if (pendingNewsCount === 0) {
      return res.status(404).json({ message: "No pending news found" });
    }

    let newsQuery = News.find(query)
      .select(selectedFields)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(
        order === "asc"
          ? { createdAt: 1 }
          : order === "desc"
          ? { createdAt: -1 }
          : undefined
      );

    const news = await newsQuery.exec();
    res.status(200).json({ news, totalPages });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const getApprovedNews = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  const { category, subcategory, type, status, tags, limit, order } = req.query;
  const page =
    parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
  const pageSize =
    parseInt(
      typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
    ) || 5;
  try {
    let query: NewsQuery = { status: "approved" };
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
      (query as any).tags = { $in: (tags as string).split(",") };
    }
    //Filter by status
    if (status) {
      query.status = status;
    }
    const selectedFields =
      "_id file title slug author tags status newsCategory subCategory liveUpdateType createdAt";

    // Check if there are pending news articles in the database
    const pendingNewsCount = await News.countDocuments({ status: "approved" });
    const totalPages = Math.ceil(pendingNewsCount / pageSize);
    if (pendingNewsCount === 0) {
      return res.status(404).json({ message: "No approved news found" });
    }

    let newsQuery = News.find(query)
      .select(selectedFields)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(
        order === "asc"
          ? { createdAt: 1 }
          : order === "desc"
          ? { createdAt: -1 }
          : undefined
      );

    const news = await newsQuery.exec();
    res.status(200).json({ news, totalPages });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const getRejectedNews = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  const { category, subcategory, type, status, tags, limit, order } = req.query;
  const page =
    parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
  const pageSize =
    parseInt(
      typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
    ) || 5;
  try {
    let query: NewsQuery = { status: "rejected" };
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
      (query as any).tags = { $in: (tags as string).split(",") };
    }
    //Filter by status
    if (status) {
      query.status = status;
    }
    const selectedFields =
      "_id file title slug author tags status newsCategory subCategory liveUpdateType createdAt";

    // Check if there are pending news articles in the database
    const pendingNewsCount = await News.countDocuments({ status: "rejected" });
    const totalPages = Math.ceil(pendingNewsCount / pageSize);
    if (pendingNewsCount === 0) {
      return res.status(404).json({ message: "No Rejected news found" });
    }

    let newsQuery = News.find(query)
      .select(selectedFields)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort(
        order === "asc"
          ? { createdAt: 1 }
          : order === "desc"
          ? { createdAt: -1 }
          : undefined
      );

    const news = await newsQuery.exec();
    res.status(200).json({ news, totalPages });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const approveNews = async (req: Request, res: Response) => {
  try {
    const newsId = req.params.id;
    const news = await News.findByIdAndUpdate(
      newsId,
      { status: "approved" },
      { new: true }
    );
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }
    res.status(200).send({ message: "News approved successfully", news });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const rejectNews = async (req: Request, res: Response) => {
  try {
    const newsId = req.params.id;
    const news = await News.findByIdAndUpdate(
      newsId,
      { status: "rejected" },
      { new: true }
    );
    if (!news) {
      return res.status(404).send({ message: "News not found" });
    }
    res.status(200).send({ message: "News rejected successfully", news });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

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

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const totalNews = await News.countDocuments();
    const approvedNews = await News.countDocuments({ status: "approved" });
    const rejectedNews = await News.countDocuments({ status: "rejected" });
    const pendingNews = await News.countDocuments({
      status: { $nin: ["approved", "rejected"] },
    });

    res
      .status(200)
      .send({ totalNews, approvedNews, rejectedNews, pendingNews });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const moderateComment = async (req: Request, res: Response) => {
  try {
    const commentId = req.params.id;
    const action = req.body.action;
    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { status: action },
      { new: true }
    );
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    res
      .status(200)
      .send({ message: `Comment ${action}d successfully`, comment });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;

    if (!req.user || !userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { title, caption, category, subCategory, tags, altText } = req.body;

    if (!altText || !title) {
      return res.status(400).send({ error: "Alt text and title are required" });
    }

    const mediaFiles = req.body.cloudinaryUrls || [];

    if (!Array.isArray(mediaFiles) || mediaFiles.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one media file is required" });
    }

    const newMedia = new Media({
      author: userId,
      title,
      files: mediaFiles.map((f: any) => ({
        url: f.url,
        public_id: f.public_id,
        format: f.format || null,
        size: f.size || null,
        type: f.type || "other",
        responsive: f.responsive || [],
      })),
      caption,
      category,
      subCategory,
      tags: Array.isArray(tags) ? tags : [tags],
      altText,
    });

    const savedMedia = await newMedia.save();

    res.status(201).json({
      success: true,
      message: "Medias uploaded and saved successfully",
      media: savedMedia,
    });
  } catch (error) {
    console.error("Error uploading medias:", error);
    res.status(500).json({ error: "Failed to upload medias" });
  }
};

// Fetch all Medias
export const getMedias = async (req: Request, res: Response) => {
  try {
    let medias;
    if (req.user.role === "admin") {
      // Admin can see all medias
      medias = await Media.find()
        .populate("category")
        .populate("subCategory")
        .sort({ createdAt: -1 });
    } else {
      // Non-admin users can only see their own medias
      medias = await Media.find({ user: req.user._id })
        .populate("category")
        .populate("subCategory")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(medias);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medias" });
  }
};
export const getAllMedias = async (req: Request, res: Response) => {
  try {
    const medias = await Media.find()
      .populate("category")
      .populate("subCategory")
      .sort({ createdAt: -1 });

    res.status(200).json(medias);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medias" });
  }
};

// Fetch medias by category or tag
export const getMediasByCategoryOrTag = async (req: Request, res: Response) => {
  try {
    const { category, subCategory, tag } = req.query as {
      category?: string;
      subCategory?: string;
      tag?: string;
    };
    let filter: any = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (tag) filter.tags = tag;

    const medias = await Media.find(filter)
      .populate("category")
      .populate("subCategory")
      .sort({ createdAt: -1 });

    res.status(200).json(medias);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch medias" });
  }
};

// Delete an media and all associated files from Cloudinary
export const deleteMediaByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the media by ID in the database
    const media = await Media.findById(id);

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    // Delete each media in the files array using its public_id
    const deleteResults = await Promise.all(
      media.files.map(async (file) => {
        console.log("Deleting media with public_id:", file.public_id);
        const result = await cloudinary.uploader.destroy(file.public_id);
        if (result.result !== "ok") {
          console.error(`Failed to delete media: ${file.public_id}`, result);
          return result;
        }
        return result;
      })
    );

    const failedDeletions = deleteResults.filter(
      (result) => result.result !== "ok"
    );

    if (failedDeletions.length > 0) {
      return res
        .status(500)
        .json({ error: "Failed to delete some medias from Cloudinary" });
    }

    // Remove the media document from MongoDB
    await Media.findByIdAndDelete(id);

    return res.status(200).json({
      message:
        "All medias and the associated media document deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting media:", error);
    return res.status(500).json({ error: error.message });
  }
};

// get all medias by admin
export const medias = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const medias = await Media.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalMedias = await Media.countDocuments();

    res.json({
      medias,
      totalPages: Math.ceil(totalMedias / limit),
      currentPage: page,
    });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const getSingleMedia = async (req: Request, res: Response) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: "Media not found" });
    }
    res.status(200).json({ media });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({ message: "Failed to fetch media details" });
  }
};

export const getDeletedNews = async (req: Request, res: Response) => {
  try {
    const page =
      parseInt(typeof req.query.page === "string" ? req.query.page : "1") || 1;
    const pageSize =
      parseInt(
        typeof req.query.pageSize === "string" ? req.query.pageSize : "5"
      ) || 5;
    const userId = (req.user as any)._id;

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
      populate: [
        {
          path: "author",
          select: "username email",
        },
      ],
    };
    const query = { author: userId, isDeleted: true };

    const paginatedNews = await News.paginate(query, options);
    res.json({
      news: paginatedNews.docs,
      totalPages: paginatedNews.totalPages,
    });
  } catch (error) {
    console.error("Error fetching deleted news:", error);
    throw new Error("Failed to fetch deleted news");
  }
};

export const mainSearch = async function (req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const searchText = req.query.q as string;

    const query = {
      $or: [
        { title: { $regex: searchText, $options: "i" } },
        { tags: { $regex: searchText, $options: "i" } },
        { newsCategory: { $regex: searchText, $options: "i" } },
        { subCategory: { $regex: searchText, $options: "i" } },
        { author: { $regex: searchText, $options: "i" } },
      ],
      isDeleted: false,
    };

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
    };

    const totalResults = await News.countDocuments(query);
    const paginatedNews = await News.paginate(query, options);

    res.json({
      news: paginatedNews.docs,
      totalPages: Math.ceil(totalResults / pageSize),
      currentPage: page,
    });
  } catch (error) {
    console.error("Error in main search:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOldestNewsArticleByType = async (
  req: Request,
  res: Response
) => {
  const { liveUpdateType } = req.query;
  const query = liveUpdateType ? { liveUpdateType } : {};
  try {
    const oldestNewsArticle = await News.findOne(query)
      .sort({ createdAt: 1 })
      .populate("author");

    if (oldestNewsArticle) {
      res.status(200).json(oldestNewsArticle);
    } else {
      res.status(404).json({ message: "No live updates found for this type" });
    }
  } catch (error) {
    console.error("Error fetching oldest live update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getNewsByLiveUpdateType = async (req: Request, res: Response) => {
  const { liveUpdateType } = req.query;
  const query = liveUpdateType ? { liveUpdateType, isLiveUpdate: true } : {};
  try {
    const newsArticles = await News.find(query)
      .sort({ createdAt: -1 })
      .populate("author");
    if (newsArticles.length > 0) {
      res.status(200).json(newsArticles);
    } else {
      res.status(404).json({ message: "No live updates found for this type" });
    }
  } catch (error) {
    console.error("Error fetching live updates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllLiveUpdates = async (req: Request, res: Response) => {
  try {
    const liveUpdates = await News.find({ isLiveUpdate: true })
      .sort({ createdAt: -1 })
      .populate("author");
    if (liveUpdates.length > 0) {
      res.status(200).json(liveUpdates);
    } else {
      res.status(404).json({ message: "No live updates found" });
    }
  } catch (error) {
    console.error("Error fetching live updates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
