import { Request, Response } from "express";
import Notifications from "../models/Notifications";

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notifications.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const unreadCount = await Notifications.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    res.json({ success: true, notifications, unreadCount });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch notifications" });
  }
};

// Mark a notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    await Notifications.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update notification" });
  }
};
