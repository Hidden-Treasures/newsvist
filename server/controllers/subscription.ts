import { Request, Response } from "express";
import Subscription from "../models/Subscription";

export const subscription = async (req: Request, res: Response) => {
  try {
    const subscription = req.body;
    await Subscription.create(subscription);
    res.status(201).json({});
  } catch (error) {
    console.error("Failed to save subscription:", error);
    res.status(500).json({ error: "Failed to save subscription" });
  }
};
