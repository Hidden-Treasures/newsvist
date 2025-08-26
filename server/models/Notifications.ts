import mongoose, { Document, Schema } from "mongoose";

interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  type: "article" | "comment" | "system";
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["article", "comment", "system"],
      default: "system",
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
