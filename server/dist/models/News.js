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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const NewsSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Biography",
    },
    slug: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    publishedAt: {
        type: Date,
    },
    isAdvertisement: {
        type: Boolean,
        default: false,
    },
    published: { type: Boolean, default: false },
    file: {
        type: Object,
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        responsive: [URL],
    },
    video: {
        type: Object,
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        // required: true,
    },
    city: {
        type: String,
        default: "",
    },
    images: [{ type: String }],
    newsCategory: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    type: {
        type: String,
    },
    tags: [{ type: String }],
    editorText: {
        type: String,
    },
    isLiveUpdate: {
        type: Boolean,
    },
    liveUpdateType: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    liveUpdateHeadline: {
        type: String,
    },
    editor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });
NewsSchema.plugin(mongoose_paginate_v2_1.default);
const News = mongoose_1.default.model("News", NewsSchema, "News");
exports.default = News;
