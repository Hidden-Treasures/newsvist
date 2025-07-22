import mongoose, { Document, model, Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

interface FileObject {
  url: string;
  public_id: string;
  responsive?: string[];
}

interface INews extends Document {
  title: string;
  user: mongoose.Types.ObjectId;
  name: mongoose.Types.ObjectId;
  slug: string;
  publishedAt?: Date;
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
  authorName?: string;
  isLiveUpdate?: boolean;
  liveUpdateType?: string;
  views: number;
  status: "pending" | "approved" | "rejected";
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bio",
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
    authorName: {
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
