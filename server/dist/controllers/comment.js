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
exports.getComments = exports.createComment = void 0;
const Comment_1 = __importDefault(require("../models/Comment"));
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId, commentText, name, parentCommentId } = req.body;
        const comment = new Comment_1.default({
            article: articleId,
            commentText,
            name: name || "Anonymous",
            isAnonymous: !req.user,
        });
        if (req.user) {
            comment.user = req.user._id;
            comment.isAnonymous = false;
        }
        if (parentCommentId) {
            const parentComment = yield Comment_1.default.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: "Parent comment not found" });
            }
            comment.parentComment = parentCommentId;
            yield comment.save();
            parentComment.replies.push(comment._id);
            yield parentComment.save();
        }
        else {
            yield comment.save();
        }
        res.status(201).json({ message: "Comment added successfully", comment });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createComment = createComment;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { articleId } = req.params;
        const comments = yield Comment_1.default.find({
            article: articleId,
            parentComment: null,
        })
            .populate({
            path: "replies",
            populate: { path: "replies" },
        })
            .populate("user", "username", "profilePhoto")
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getComments = getComments;
