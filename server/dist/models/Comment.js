"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    article: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    isAnonymous: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: false,
    },
    commentText: {
        type: String,
        required: true,
    },
    parentComment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
        required: false,
    },
    replies: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
}, { timestamps: true });
const Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.default = Comment;
