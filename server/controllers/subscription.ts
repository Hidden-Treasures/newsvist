import { Request, Response } from "express";
import Subscription, { ISubscription } from "../models/Subscription";

export const subscription = async (req: Request, res: Response) => {
  try {
    const { endpoint, keys, categories } = req.body as Partial<ISubscription>;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return res.status(400).json({ error: "Invalid subscription payload" });
    }

    const saved = await Subscription.findOneAndUpdate(
      { endpoint },
      {
        endpoint,
        keys,
        categories:
          categories && categories.length > 0 ? categories : ["BreakingNews"],
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, subscription: saved });
  } catch (error) {
    console.error("Failed to save subscription:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
};
