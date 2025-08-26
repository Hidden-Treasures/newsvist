import mongoose, { Document, model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

interface FileObject {
  url: string;
  public_id: string;
  responsive?: string[];
}

interface INews extends Document {
  title: string;
  author?: mongoose.Types.ObjectId;
  name: mongoose.Types.ObjectId;
  slug: string;
  publishedAt?: Date;
  isAdvertisement: boolean;
  published: boolean;
  file: FileObject;
  video?: FileObject;
  city?: string;
  images: string[];
  newsCategory?: string;
  subCategory?: string;
  type?: string;
  tags: string[];
  editorText?: string;
  liveUpdateType?: string;
  views: number;
  status: "draft" | "pending" | "approved" | "rejected" | "scheduled";
  liveUpdateHeadline?: string;
  editor?: mongoose.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Biography",
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    publishedAt: { type: Date },
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
    liveUpdateType: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "scheduled"],
      default: "pending",
    },
    editor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);
NewsSchema.plugin(paginate);

const News = mongoose.model<INews, mongoose.PaginateModel<INews>>(
  "News",
  NewsSchema,
  "News"
);
export default News;
