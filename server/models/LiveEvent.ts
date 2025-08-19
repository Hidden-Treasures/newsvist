import mongoose, { Schema, Document } from "mongoose";

interface ILiveEvent extends Document {
  liveUpdateType: string;
  headline: string;
  createdAt: Date;
  updatedAt: Date;
}

const LiveEventSchema = new Schema<ILiveEvent>(
  {
    liveUpdateType: { type: String, unique: true, required: true },
    headline: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILiveEvent>("LiveEvent", LiveEventSchema);
