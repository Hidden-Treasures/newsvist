"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const news_1 = require("../../controllers/news");
const express_1 = __importDefault(require("express"));
const news_2 = require("../../controllers/news");
const user_1 = require("../../controllers/user");
const auth_1 = require("../../middlewares/auth");
const multer_1 = require("../../middlewares/multer");
const validator_1 = require("../../middlewares/validator");
const helper_1 = require("../../utils/helper");
const biography_1 = require("../../controllers/biography");
const comment_1 = require("../../controllers/comment");
const livescore_1 = require("../../controllers/livescore");
const subscription_1 = require("../../controllers/subscription");
// const { upload } = require("../s3Upload");
const route = express_1.default.Router();
route.post("/register", user_1.register);
route.post("/login", user_1.login);
route.get("/check-auth", auth_1.isAuth, auth_1.checkAuth);
route.post("/logout", auth_1.isAuth, user_1.logout);
route.get("/main-search", news_2.mainSearch);
route.get("/getNewsByLiveUpdateType/:liveUpdateType", news_2.getNewsByLiveUpdateType);
route.get("/getAllLiveUpdates", news_2.getAllLiveUpdates);
route.get("/getOldestNewsArticleByType/:liveUpdateType", news_2.getOldestNewsArticleByType);
// ..............News Route...........
route.post("/upload-video", auth_1.isAuth, auth_1.canCreateRead, multer_1.upload.single("video"), validator_1.validateVideo, multer_1.uploadToCloudinary, news_2.videoUpload);
route.post("/create-news", auth_1.isAuth, auth_1.canCreateRead, multer_1.upload.single("file"), helper_1.parseData, validator_1.validateNews, validator_1.validate, multer_1.uploadToCloudinary, news_2.createNews);
route.get("/news", news_1.getNews);
// Route to get articles by category and subcategory
route.get("/articles/by-category", news_2.getArticlesByCategory);
// route.get("/:category/:subcategory", getArticlesByCategory);
route.get("/most-recent", auth_1.isAuth, news_2.getMostRecentNews);
route.get("/missed-news", news_2.getMissedNews);
route.get("/newsByTags", news_2.getNewsByTags);
route.post("/addType", auth_1.isAuth, auth_1.canCreateRead, news_2.addType);
route.delete("/deleteType/:typeId", auth_1.isAuth, auth_1.canCreateRead, news_2.deleteType);
route.get("/types", auth_1.isAuth, news_2.getNewsType);
route.get("/getLastFiveLiveUpdateNewsType", auth_1.isAuth, news_2.getLastFiveLiveUpdateNewsType);
route.get("/getHeadline/:liveUpdateType", auth_1.isAuth, news_2.getHeadLine);
route.get("/getAllNewsCategories", news_2.getAllNewsCategories);
route.get("/getsubcategories/:catName", auth_1.isAuth, news_2.getAllNewsSubCategories);
route.get("/newsList", auth_1.isAuth, auth_1.isAdmin, news_2.newsList);
route.get("/allNewsList", auth_1.isAuth, auth_1.isAdmin, news_2.allNewsList);
route.get("/editor-newsList", auth_1.isAuth, auth_1.isEditor, news_2.editorNewsList);
route.get("/writer-newsList", auth_1.isAuth, auth_1.isJournalist, news_2.writerNewsList);
route.delete("/news/:newsId", auth_1.isAuth, auth_1.canCreateRead, news_2.deleteNews);
route.get("/recycle-bin", auth_1.isAuth, news_2.getDeletedNews);
route.delete("/recycle-bin/:newsId", auth_1.isAuth, auth_1.canCreateRead, news_2.addToNewsRecycleBin);
route.patch("/news/restore/:newsId", auth_1.isAuth, auth_1.canCreateRead, news_2.restoreNews);
route.get("/getNewsByID/:id", auth_1.isAuth, auth_1.canCreateRead, news_2.getNewsById);
route.patch("/update/:newsId", auth_1.isAuth, auth_1.canCreateRead, multer_1.upload.single("file"), helper_1.parseData, validator_1.validate, multer_1.uploadToCloudinary, news_2.updateNews);
route.get("/for-update/:newsId", auth_1.isAuth, auth_1.canCreateRead, news_2.getNewsForUpdate);
// route.get("/filesForNewsByFilename/:filename", filesForNewsByFilename);
route.get("/categories-and-sub", news_1.AllCategoriesWithSubCategory);
route.delete("/deleteCategories/:categoryId", auth_1.isAuth, auth_1.canCreateRead, news_1.deleteCategory);
route.delete("/categories/:categoryId/subCategories/:subCategoryId", auth_1.isAuth, auth_1.canCreateRead, news_1.deleteSubCategory);
route.post("/addCategories", auth_1.isAuth, auth_1.canCreateRead, news_1.addCategory);
route.put("/updateCategory/:id", auth_1.isAuth, auth_1.canCreateRead, news_1.updateCategory);
route.put("/updateSubCategory/:categoryId/subcategory/:subcategoryId", auth_1.isAuth, auth_1.canCreateRead, news_1.updateSubCategory);
route.get("/users", auth_1.isAuth, auth_1.isAdmin, news_1.users);
route.post("/assignRole/:userId", auth_1.isAuth, news_1.assignRole);
route.get("/user/:userid", auth_1.isAuth, auth_1.isAdmin, news_1.getUserbyID);
route.delete("/deleteUsersManually/:id", auth_1.isAuth, auth_1.isAdmin, news_1.deleteUsersManually);
route.post("/updateUserData/:userid", auth_1.isAuth, news_1.updateUserData);
route.get("/getNewsBySlug/:slug", news_1.getNewsBySlug);
route.get("/related-news", news_1.getRelatedNews);
route.get("/news-and-buzz", news_1.getNewsAndBuzz);
route.get("/up-next/:slug", news_1.getUpNextArticles);
route.get("/most-read", news_1.getMostReadArticles);
route.get("/pending", auth_1.isAuth, auth_1.canCreateRead, news_1.getPendingNews);
route.get("/approved", auth_1.isAuth, auth_1.canCreateRead, news_1.getApprovedNews);
route.get("/rejected", auth_1.isAuth, auth_1.canCreateRead, news_1.getRejectedNews);
route.put("/approve/:id", auth_1.isAuth, auth_1.canCreateRead, news_1.approveNews);
route.put("/reject/:id", auth_1.isAuth, auth_1.canCreateRead, news_1.rejectNews);
route.get("/analytics", auth_1.isAuth, auth_1.isAdmin, news_1.getAnalytics);
route.put("/comment/:id", auth_1.isAuth, auth_1.isAdmin, news_1.moderateComment);
// Route to create a new image with file upload
route.post("/images", auth_1.isAuth, multer_1.upload.array("images", 5), multer_1.uploadToCloudinary, news_1.createImage);
route.get("/images", auth_1.isAuth, news_1.getImages);
route.get("/imageByCat", news_1.getImageArticlesByCategory);
// Route to fetch all images
route.get("/all-images", news_1.getAllImages);
// Route to get all images By Admin
route.get("/image-gallery", news_1.images);
// Route to fetch images by category, subcategory, or tag
route.get("/images/filter", news_1.getImagesByCategoryOrTag);
// Route to delete an image
route.delete("/images/delete-by-user/:id", news_1.deleteImageByUser);
// Route to get image details
route.get("/image/:id", news_1.getSingleImage);
// ..............News Route...........
// ..............COMMENT ROUTE ...........
// Route to create a new comment or reply
route.post("/comment", validator_1.commentValidation, comment_1.createComment);
// Route to get comment or reply
route.get("/comments/:articleId", comment_1.getComments);
// ..............COMMENT ROUTE ...........
// ..............USER ROUTE............
// Route for updating user profile
route.get("/my-profile", auth_1.isAuth, user_1.getUserDetails);
route.put("/me/:userId", auth_1.isAuth, multer_1.upload.single("profilePhoto"), multer_1.uploadToCloudinary, user_1.updateUser);
route.put("/update-status", auth_1.isAuth, user_1.updateAccountStatus);
route.get("/user-analytics", auth_1.isAuth, user_1.getUserAnalytics);
route.put("/bulk-update-status", auth_1.isAuth, user_1.bulkUpdateUserStatus);
route.post("/initiate-reset", user_1.initiatePasswordReset);
route.post("/reset-password", user_1.resetPassword);
// Route for users to apply to be a writer or editor
// route.post("/apply", isAuth, applyToBeWriterOrEditor);
// Routes for admin to manage applications
// route.get("/applications", getApplications);
// route.put("/applications/:id", updateApplicationStatus);
// ..............SUBSCRIPTION............
route.post("/subscribe", subscription_1.subscription);
// ..............USER ROUTE............
// ..............LIVE SCORE ROUTE............
route.get("/live-scores", livescore_1.liveScores);
// ..............LIVE SCORE ROUTE END............
// ..............BIOGRAPHY ROUTE............
route.post("/bio", auth_1.isAuth, auth_1.canCreateRead, multer_1.upload.single("image"), multer_1.uploadToCloudinary, biography_1.createBiography);
route.get("/bio", auth_1.isAuth, auth_1.canCreateRead, biography_1.getAllBiography);
route.get("/biographies", biography_1.getBiographies);
route.get("/bio/:id", auth_1.isAuth, auth_1.canCreateRead, biography_1.getBiographyById);
route.put("/bio/:id", auth_1.isAuth, auth_1.canCreateRead, multer_1.upload.single("image"), multer_1.uploadToCloudinary, biography_1.updateBiography);
route.delete("/bio/:id", auth_1.isAuth, auth_1.canCreateRead, biography_1.deleteBiography);
route.get("/bio/:bioName", biography_1.getBioByName);
route.get("/bio-articles", biography_1.getArticlesByBiography);
// ..............BIOGRAPHY ROUTE END............
exports.default = route;
