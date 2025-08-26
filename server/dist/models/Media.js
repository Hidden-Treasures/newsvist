"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MediaSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    files: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
            format: { type: String },
            size: { type: Number },
            type: {
                type: String,
                enum: ["image", "video", "document", "other"],
                default: "other",
            },
            responsive: [String],
        },
    ],
    caption: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    tags: [{ type: String }],
    altText: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Media", MediaSchema);
