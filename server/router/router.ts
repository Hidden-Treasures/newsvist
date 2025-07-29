import {
  addCategory,
  AllCategoriesWithSubCategory,
  approveNews,
  assignRole,
  createImage,
  deleteCategory,
  deleteImageByUser,
  deleteSubCategory,
  deleteUsersManually,
  getAllImages,
  getAnalytics,
  getApprovedNews,
  getImageArticlesByCategory,
  getImages,
  getImagesByCategoryOrTag,
  getMostReadArticles,
  getNews,
  getNewsAndBuzz,
  getNewsBySlug,
  getPendingNews,
  getRejectedNews,
  getRelatedNews,
  getSingleImage,
  getUpNextArticles,
  getUserbyID,
  images,
  moderateComment,
  rejectNews,
  updateCategory,
  updateSubCategory,
  updateUserData,
  users,
} from "./../controllers/news";
import express from "express";

import {
  addToNewsRecycleBin,
  addType,
  allNewsList,
  createNews,
  deleteNews,
  deleteType,
  editorNewsList,
  getAllLiveUpdates,
  getAllNewsCategories,
  getAllNewsSubCategories,
  getArticlesByCategory,
  getDeletedNews,
  getHeadLine,
  getLastFiveLiveUpdateNewsType,
  getMissedNews,
  getMostRecentNews,
  getNewsById,
  getNewsByLiveUpdateType,
  getNewsByTags,
  getNewsForUpdate,
  getNewsType,
  getOldestNewsArticleByType,
  mainSearch,
  newsList,
  restoreNews,
  updateNews,
  videoUpload,
  writerNewsList,
} from "../controllers/news";
import {
  bulkUpdateUserStatus,
  getUserAnalytics,
  getUserDetails,
  initiatePasswordReset,
  login,
  logout,
  register,
  resetPassword,
  updateAccountStatus,
  updateUser,
} from "../controllers/user";
import {
  canCreateRead,
  checkAuth,
  isAdmin,
  isAuth,
  isEditor,
  isJournalist,
} from "../middlewares/auth";
import { upload, uploadToCloudinary } from "../middlewares/multer";
import {
  commentValidation,
  validate,
  validateNews,
  validateVideo,
} from "../middlewares/validator";
import { parseData } from "../utils/helper";
import {
  createBiography,
  deleteBiography,
  getAllBiography,
  getArticlesByBiography,
  getBioByName,
  getBiographies,
  getBiographyById,
  updateBiography,
} from "../controllers/biography";
import { createComment, getComments } from "../controllers/comment";
import { liveScores } from "../controllers/livescore";
import { subscription } from "../controllers/subscription";

// const { upload } = require("../s3Upload");
const route = express.Router();

route.post("/register", register);
route.post("/login", login);
route.get("/check-auth", isAuth, checkAuth);
route.post("/logout", isAuth, logout);
route.get("/main-search", mainSearch);
route.get("/getNewsByLiveUpdateType/:liveUpdateType", getNewsByLiveUpdateType);
route.get("/getAllLiveUpdates", getAllLiveUpdates);
route.get(
  "/getOldestNewsArticleByType/:liveUpdateType",
  getOldestNewsArticleByType
);

// ..............News Route...........
route.post(
  "/upload-video",
  isAuth,
  canCreateRead,
  upload.single("video"),
  validateVideo,
  uploadToCloudinary,
  videoUpload
);
route.post(
  "/create-news",
  isAuth,
  canCreateRead,
  upload.single("file"),
  parseData,
  validateNews,
  validate,
  uploadToCloudinary,
  createNews
);

route.get("/news", getNews);
// Route to get articles by category and subcategory
route.get("/articles/by-category", getArticlesByCategory);
// route.get("/:category/:subcategory", getArticlesByCategory);
route.get("/most-recent", isAuth, getMostRecentNews);
route.get("/missed-news", getMissedNews);
route.get("/news-by-tags", getNewsByTags);
route.post("/addType", isAuth, canCreateRead, addType);
route.delete("/deleteType/:typeId", isAuth, canCreateRead, deleteType);
route.get("/types", isAuth, getNewsType);
route.get(
  "/getLastFiveLiveUpdateNewsType",
  isAuth,
  getLastFiveLiveUpdateNewsType
);
route.get("/getHeadline/:liveUpdateType", isAuth, getHeadLine);
route.get("/getAllNewsCategories", getAllNewsCategories);
route.get("/getsubcategories/:catName", isAuth, getAllNewsSubCategories);
route.get("/newsList", isAuth, isAdmin, newsList);
route.get("/allNewsList", isAuth, isAdmin, allNewsList);
route.get("/editor-newsList", isAuth, isEditor, editorNewsList);
route.get("/writer-newsList", isAuth, isJournalist, writerNewsList);

route.delete("/news/:newsId", isAuth, canCreateRead, deleteNews);
route.get("/recycle-bin", isAuth, getDeletedNews);
route.delete(
  "/recycle-bin/:newsId",
  isAuth,
  canCreateRead,
  addToNewsRecycleBin
);
route.patch("/news/restore/:newsId", isAuth, canCreateRead, restoreNews);
route.get("/getNewsByID/:id", isAuth, canCreateRead, getNewsById);
route.patch(
  "/update/:newsId",
  isAuth,
  canCreateRead,
  upload.single("file"),
  parseData,
  validate,
  uploadToCloudinary,
  updateNews
);

route.get("/for-update/:newsId", isAuth, canCreateRead, getNewsForUpdate);
// route.get("/filesForNewsByFilename/:filename", filesForNewsByFilename);
route.get("/categories-and-sub", AllCategoriesWithSubCategory);
route.delete(
  "/deleteCategories/:categoryId",
  isAuth,
  canCreateRead,
  deleteCategory
);
route.delete(
  "/categories/:categoryId/subCategories/:subCategoryId",
  isAuth,
  canCreateRead,
  deleteSubCategory
);
route.post("/addCategories", isAuth, canCreateRead, addCategory);
route.put("/updateCategory/:id", isAuth, canCreateRead, updateCategory);
route.put(
  "/updateSubCategory/:categoryId/subcategory/:subcategoryId",
  isAuth,
  canCreateRead,
  updateSubCategory
);

route.get("/users", isAuth, isAdmin, users);
route.post("/assignRole/:userId", isAuth, assignRole);
route.get("/user/:userid", isAuth, isAdmin, getUserbyID);
route.delete("/deleteUsersManually/:id", isAuth, isAdmin, deleteUsersManually);
route.post("/updateUserData/:userid", isAuth, updateUserData);
route.get("/getNewsBySlug/:slug", getNewsBySlug);
route.get("/related-news", getRelatedNews);
route.get("/news-and-buzz", getNewsAndBuzz);
route.get("/up-next/:slug", getUpNextArticles);
route.get("/most-read", getMostReadArticles);

route.get("/pending", isAuth, canCreateRead, getPendingNews);
route.get("/approved", isAuth, canCreateRead, getApprovedNews);
route.get("/rejected", isAuth, canCreateRead, getRejectedNews);
route.put("/approve/:id", isAuth, canCreateRead, approveNews);
route.put("/reject/:id", isAuth, canCreateRead, rejectNews);

route.get("/analytics", isAuth, isAdmin, getAnalytics);

route.put("/comment/:id", isAuth, isAdmin, moderateComment);

// Route to create a new image with file upload
route.post(
  "/images",
  isAuth,
  upload.array("images", 5),
  uploadToCloudinary,
  createImage
);

route.get("/images", isAuth, getImages);
route.get("/imageByCat", getImageArticlesByCategory);
// Route to fetch all images
route.get("/all-images", getAllImages);

// Route to get all images By Admin
route.get("/image-gallery", images);

// Route to fetch images by category, subcategory, or tag
route.get("/images/filter", getImagesByCategoryOrTag);

// Route to delete an image
route.delete("/images/delete-by-user/:id", deleteImageByUser);

// Route to get image details
route.get("/image/:id", getSingleImage);

// ..............News Route...........

// ..............COMMENT ROUTE ...........
// Route to create a new comment or reply
route.post("/comment", commentValidation, createComment);
// Route to get comment or reply
route.get("/comments/:articleId", getComments);

// ..............COMMENT ROUTE ...........

// ..............USER ROUTE............
// Route for updating user profile
route.get("/my-profile", isAuth, getUserDetails);
route.put(
  "/me/:userId",
  isAuth,
  upload.single("profilePhoto"),
  uploadToCloudinary,
  updateUser
);

route.put("/update-status", isAuth, updateAccountStatus);
route.get("/user-analytics", isAuth, getUserAnalytics);
route.put("/bulk-update-status", isAuth, bulkUpdateUserStatus);
route.post("/initiate-reset", initiatePasswordReset);
route.post("/reset-password", resetPassword);

// Route for users to apply to be a writer or editor
// route.post("/apply", isAuth, applyToBeWriterOrEditor);

// Routes for admin to manage applications
// route.get("/applications", getApplications);
// route.put("/applications/:id", updateApplicationStatus);

// ..............SUBSCRIPTION............
route.post("/subscribe", subscription);
// ..............USER ROUTE............
// ..............LIVE SCORE ROUTE............
route.get("/live-scores", liveScores);
// ..............LIVE SCORE ROUTE END............
// ..............BIOGRAPHY ROUTE............
route.post(
  "/bio",
  isAuth,
  canCreateRead,
  upload.single("image"),
  uploadToCloudinary,
  createBiography
);
route.get("/bio", isAuth, canCreateRead, getAllBiography);
route.get("/biographies", getBiographies);
route.get("/bio/:id", isAuth, canCreateRead, getBiographyById);
route.put(
  "/bio/:id",
  isAuth,
  canCreateRead,
  upload.single("image"),
  uploadToCloudinary,
  updateBiography
);
route.delete("/bio/:id", isAuth, canCreateRead, deleteBiography);
route.get("/bio/:bioName", getBioByName);
route.get("/bio-articles", getArticlesByBiography);
// ..............BIOGRAPHY ROUTE END............

export default route;
