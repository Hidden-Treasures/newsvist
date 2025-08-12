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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const BiographySchema = new mongoose_1.Schema({
    realName: { type: String, required: true, unique: true },
    stageName: { type: String },
    aliasName: { type: String },
    dateOfBirth: { type: Date },
    hometown: { type: String },
    category: {
        type: String,
        enum: [
            "Music Artist",
            "Footballer",
            "Influencer",
            "Creator",
            "Politician",
            "Scientist",
            "Actor",
            "Entrepreneur",
            "Author",
        ],
        required: true,
    },
    label: { type: String },
    position: { type: String },
    niche: { type: String },
    genre: { type: String },
    club: { type: String },
    platform: { type: String },
    socialMedia: {
        type: Map,
        of: String,
    },
    bio: { type: String, required: true },
    image: { type: String, required: true },
    public_id: { type: String, required: true },
    nationality: { type: String },
    gender: { type: String },
    occupations: [{ type: String }],
    education: [{ type: String }],
    awards: [{ type: String }],
    notableWorks: [{ type: String }],
    deathDate: { type: Date },
    spouse: { type: String },
    children: [{ type: String }],
    activeYears: { type: String },
    placeOfBirth: { type: String },
    placeOfDeath: { type: String },
    quotes: [{ type: String }],
    references: [{ type: String }],
}, { timestamps: true });
const Biography = mongoose_1.default.model("Biography", BiographySchema);
exports.default = Biography;
