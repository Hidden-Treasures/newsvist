import mongoose, { Schema, Document } from "mongoose";

interface FileObject {
  url: string;
  public_id: string;
  responsive?: string[];
}

interface ILiveUpdateEntry extends Document {
  event: mongoose.Types.ObjectId;
  title: string;
  content: string;
  file?: FileObject;
  video?: FileObject;
  author: mongoose.Types.ObjectId;
  createdAt: Date;
}

const LiveUpdateEntrySchema = new Schema<ILiveUpdateEntry>(
  {
    event: { type: Schema.Types.ObjectId, ref: "LiveEvent", required: true },
    title: { type: String, required: true },
    content: { type: String },
    file: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String },
      responsive: [URL],
    },
    video: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String },
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model<ILiveUpdateEntry>(
  "LiveUpdateEntry",
  LiveUpdateEntrySchema
);
