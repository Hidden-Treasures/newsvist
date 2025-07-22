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
import Image from "../models/Image";
import Comment from "../models/Comment";
import { nanoid } from "nanoid";
import slugify from "slugify";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

async function generateUniqueSlug(title: string): Promise<string> {
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

// const { s3Client } = require("../s3Upload");
const cloudinary = require("../cloud");
// const { GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
const { PassThrough } = require("stream");
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
      authorName,
      isLiveUpdate,
      liveUpdateType,
      liveUpdateHeadline,
      video,
      city,
      name,
    } = req.body;

    let bioId = null;

    if (name) {
      const bio = await Biography.findOne({
        stageName: new RegExp(`^${name}$`, "i"),
      });
      if (bio) {
        bioId = bio._id;
      }
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
      authorName,
      isLiveUpdate,
      liveUpdateType,
      liveUpdateHeadline,
      city,
      video,
      user: userId,
      name: bioId,
    });

    if (isAdmin || isEditor) {
      newNews.status = "approved";
      newNews.published = true;
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

    const year = newNews.createdAt.getFullYear();
    const month = String(newNews.createdAt.getMonth() + 1).padStart(2, "0");
    const day = String(newNews.createdAt.getDate()).padStart(2, "0");
    const category = newNews.newsCategory;

    const baseUrl = "https://www.newsvist.com";
    const articleUrl = `${baseUrl}/${year}/${month}/${day}/${category}/${newNews._id}`;

    const payload = JSON.stringify({
      title: "New Article Available from NewsVist",
      body: `We are pleased to announce a new article titled "${newNews.title}" has been published. Click here to read it.`,
      url: articleUrl,
    });

    const subscriptions = await Subscription.find();
    subscriptions.forEach((subscription) => {
      webpush.sendNotification(subscription, payload).catch((error: any) => {
        console.error("Error sending notification:", error);
      });
    });

    res.status(201).json({ news: { id: newNews._id, title } });
  } catch (err) {
    console.error("Error saving news:", err);
    res.status(500).json({ error: "Failed to save news" });
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
    const userId = (req.user as any).userId;

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
    };
    const query = { user: userId, isDeleted: false };

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
    const isAdmin = role === "Admin";
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
    const userId = req.user.userId;

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
    };
    const query = { user: userId, isDeleted: false };

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
    authorName,
    tags,
    city,
    video,
    name,
  } = req.body;

  news.title = title;
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
    if (imageFiles.length > 0 && news.file?.public_id) {
      const { result } = await cloudinary.uploader.destroy(news.file.public_id);
      if (result !== "ok") {
        return sendError(res, "Could not delete existing image!");
      }
    }
    if (imageFiles.length > 0) {
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
    },
  });
};

export const getNewsForUpdate = async (req: Request, res: Response) => {
  const { newsId } = req.params;
  const editorId = req.user.userId;

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
      authorName: news.authorName,
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
  const { newsId } = req.params;

  if (!isValidObjectId(newsId)) return sendError(res, "Invalid News ID!");

  const news = await News.findById(newsId);
  if (!news) return sendError(res, "News Not Found!", 404);

  const imageId = news.file?.public_id;
  if (imageId) {
    const { result } = await cloudinary.uploader.destroy(imageId);
    if (result !== "ok")
      return sendError(res, "Could not remove image from cloud!");
  }

  // removing video
  const videoId = news.video?.public_id;
  if (videoId) {
    const { result } = await cloudinary.uploader.destroy(videoId, {
      resource_type: "video",
    });
    if (result !== "ok")
      return sendError(res, "Could not remove video from cloud!");
  }
  // if (!videoId) return sendError(res, "Could not find video in the cloud!");

  await News.findByIdAndDelete(newsId);

  res.json({ message: "News removed successfully." });
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

// export const addCategory = async (req: Request, res: Response) => {
//   const { name, subcategories, parentCategory } = req.body;
//   console.log("subCat :", subcategories);
//   console.log("parentCategory :", parentCategory);
//   try {
//     if (!subcategories) {
//       const newCategory = new Category({ title: name });
//       const savedCategory = await newCategory.save();
//       res.status(201).json(savedCategory);
//     } else {
//       // Find the parent category by its ID
//       const category = await Category.findById(parentCategory);
//       console.log("category get :", category);
//       // Add the new subcategory to the subcategories array
//       category.items.push({ name: subcategories });

//       // Save the updated category
//       const savedCategory = await category.save();

//       res.status(201).json(savedCategory);
//     }
//   } catch (error) {
//     console.error("Error adding category:", error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

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
  const _id = req.user.userId;
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
      res.json(lastLiveUpdate.liveUpdateHeadline);
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
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(6);

    // Fetch the most recent sports article in the Football subcategory
    const sportsArticle = await News.findOne({
      published: true,
      newsCategory: "Sports",
      subCategory: "Football",
    })
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch the most recent tech article and 5 other tech articles
    const recentTechArticle = await News.findOne({
      published: true,
      newsCategory: "Tech",
    })
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(1);

    const otherTechArticles = await News.find({
      published: true,
      newsCategory: "Tech",
      ...(recentTechArticle ? { _id: { $ne: recentTechArticle._id } } : {}),
    })
      .populate("user")
      .sort({ createdAt: -1 })
      .limit(6);
    // Fetch articles from both World and Business categories
    const worldAndBusinessArticles = await News.find({
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
  } catch (error) {
    res.status(500).json({ message: "Error fetching articles", error });
  }
};

export const getNews = async (
  req: Request<{}, {}, {}, GetNewsQuery>,
  res: Response
) => {
  const { category, subcategory, type, tags, limit, order } = req.query;
  try {
    let query: NewsQuery = { status: "approved", isDeleted: false };

    if (category) query.newsCategory = category;
    if (subcategory) query.subCategory = subcategory;
    if (type) query.type = type;
    if (tags) {
      const tagIds = (tags as string)
        .split(",")
        .map((tag) => new mongoose.Types.ObjectId(tag));
      query.tags = { $in: tagIds };
    }

    const selectedFields =
      "_id file video title tags name newsCategory subCategory liveUpdateType createdAt";

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
      query.tags = {
        $in: tags.split(",").map((tag) => new mongoose.Types.ObjectId(tag)),
      };
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
      .populate("user");

    const totalNews = await News.countDocuments({
      tags: { $in: tagArray },
      isDeleted: false,
    });

    res.json({ news, totalNews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getNewsByArticleId = async (req: Request, res: Response) => {
  try {
    // Find the article by ID and increment the views by 1
    const article = await News.findByIdAndUpdate(
      req.params.articleId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("user");

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    const relatedNews = await News.find({
      _id: { $ne: article._id },
      tags: { $in: article.tags },
      newsCategory: article.newsCategory,
      subCategory: article.subCategory,
      status: "approved",
    })
      .limit(3)
      .select("_id file video title tags newsCategory createdAt");

    res.json({ article, relatedNews });
  } catch (error) {
    console.log(error);
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
      query.tags = {
        $in: tags.split(",").map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    }

    if (excludeIds) {
      query._id = { $nin: excludeIds.split(",") };
    }

    let articles = News.find(query);

    if (order) {
      articles = articles.sort({ [order]: -1 });
    }

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
export const getImageArticlesByCategory = async (
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
      query.tags = {
        $in: tags.split(",").map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    }

    // Exclude specific articles by ID
    if (excludeIds) {
      query._id = { $nin: excludeIds.split(",") };
    }

    // Run query
    let articles = Image.find(query);

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
    const { articleId, tags, category } = req.query;

    const relatedNews = await News.find({
      _id: { $ne: articleId },
      $or: [{ tags: { $in: tags } }, { newsCategory: category }],
      status: "approved",
      isDeleted: false,
    })
      .limit(5)
      .select("_id file video title newsCategory createdAt");

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
    const currentArticle = await News.findById(req.params.articleId);

    if (!currentArticle) {
      return res.status(404).json({ message: "Article not found" });
    }

    const upNextArticles = await News.find({
      _id: { $ne: currentArticle._id },
      createdAt: { $gt: currentArticle.createdAt },
      status: "approved",
      isDeleted: false,
    })
      .sort({ createdAt: 1 })
      .limit(5)
      .select("_id file video title createdAt newsCategory");

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
      .select("title views newsCategory createdAt");
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
      query.tags = {
        $in: tags.split(",").map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    }
    //Filter by status
    if (status) {
      query.status = status;
    }
    const selectedFields =
      "_id file title authorName tags status newsCategory subCategory liveUpdateType createdAt";

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
      query.tags = {
        $in: tags.split(",").map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    }
    //Filter by status
    if (status) {
      query.status = status;
    }
    const selectedFields =
      "_id file title authorName tags status newsCategory subCategory liveUpdateType createdAt";

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
      query.tags = {
        $in: tags.split(",").map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    }
    //Filter by status
    if (status) {
      query.status = status;
    }
    const selectedFields =
      "_id file title authorName tags status newsCategory subCategory liveUpdateType createdAt";

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

export const createImage = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?._id;

    if (!req.user || !userId) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { title, caption, category, subCategory, tags, altText } = req.body;

    if (!altText || !title) {
      return res.status(400).send({ error: "Alt text and title are required" });
    }

    const imageFiles: FileObject[] = req.body.cloudinaryUrls || [];

    if (imageFiles.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one image file is required" });
    }

    const newImage = new Image({
      title,
      files: imageFiles,
      caption,
      category,
      subCategory,
      tags: Array.isArray(tags) ? tags : [tags],
      altText,
      user: userId,
    });

    const savedImage = await newImage.save();

    res.status(201).json({
      success: true,
      message: "Images uploaded and saved successfully",
      image: savedImage,
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

// Fetch all images
export const getImages = async (req: Request, res: Response) => {
  try {
    let images;
    if (req.user.role === "Admin") {
      // Admin can see all images
      images = await Image.find()
        .populate("category")
        .populate("subCategory")
        .sort({ createdAt: -1 });
    } else {
      // Non-admin users can only see their own images
      images = await Image.find({ user: req.user._id })
        .populate("category")
        .populate("subCategory")
        .sort({ createdAt: -1 });
    }

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
export const getAllImages = async (req: Request, res: Response) => {
  try {
    const images = await Image.find()
      .populate("category")
      .populate("subCategory")
      .sort({ createdAt: -1 });

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Fetch images by category or tag
export const getImagesByCategoryOrTag = async (req: Request, res: Response) => {
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

    const images = await Image.find(filter)
      .populate("category")
      .populate("subCategory")
      .sort({ createdAt: -1 });

    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch images" });
  }
};

// Delete an image and all associated files from Cloudinary
export const deleteImageByUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the image by ID in the database
    const image = await Image.findById(id);

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Delete each image in the files array using its public_id
    const deleteResults = await Promise.all(
      image.files.map(async (file) => {
        console.log("Deleting image with public_id:", file.public_id);
        const result = await cloudinary.uploader.destroy(file.public_id);
        if (result.result !== "ok") {
          console.error(`Failed to delete image: ${file.public_id}`, result);
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
        .json({ error: "Failed to delete some images from Cloudinary" });
    }

    // Remove the image document from MongoDB
    await Image.findByIdAndDelete(id);

    return res.status(200).json({
      message:
        "All images and the associated image document deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: error.message });
  }
};

// get all images by admin
export const images = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const images = await Image.find()
      .skip((page - 1) * limit)
      .limit(limit);

    const totalImages = await Image.countDocuments();

    res.json({
      images,
      totalPages: Math.ceil(totalImages / limit),
      currentPage: page,
    });
  } catch (error: any) {
    res
      .status(500)
      .send({ message: "Internal Server Error", error: error.message });
  }
};

export const getSingleImage = async (req: Request, res: Response) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ image });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ message: "Failed to fetch image details" });
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
    const userId = (req.user as any).userId;

    const options = {
      page: page,
      limit: pageSize,
      sort: { createdAt: -1 },
    };
    const query = { user: userId, isDeleted: true };

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
    const searchText = req.query.searchText as string;

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
  const { liveUpdateType } = req.params;
  const query = liveUpdateType ? { liveUpdateType } : {};
  try {
    const oldestNewsArticle = await News.findOne(query)
      .sort({ createdAt: 1 })
      .populate("user");

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
  const { liveUpdateType } = req.params;
  const query = liveUpdateType ? { liveUpdateType, isLiveUpdate: true } : {};
  try {
    const newsArticles = await News.find(query)
      .sort({ createdAt: -1 })
      .populate("user");
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
      .populate("user");
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
