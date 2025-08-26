import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

export default mongoose.model("Media", MediaSchema);
