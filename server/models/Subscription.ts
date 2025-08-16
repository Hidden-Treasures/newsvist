import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  categories?: string[];
}

const SubscriptionSchema = new Schema<ISubscription>({
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  categories: [{ type: String }],
});

const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);

export default Subscription;
