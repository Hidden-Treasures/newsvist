import { NextFunction, Request, Response } from "express";
import User from "../models/User";

const crypto = require("crypto");

export const sendError = (res: Response, error: unknown, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

export const parseData = (req: Request, res: Response, next: NextFunction) => {
  const { video, tags } = req.body;
  if (video) req.body.video = JSON.parse(video);
  if (tags) req.body.tags = JSON.parse(tags);

  next();
};

// Function to generate the reset token
export const generateResetToken = () => {
  const buffer = crypto.randomBytes(32);
  return buffer.toString("hex");
};

export const generateUniqueUsername = async (base: string) => {
  let username = base.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  if (!username) username = "user";

  let exists = await User.findOne({ username });
  let counter = 1;

  while (exists) {
    username = `${username}${Math.floor(Math.random() * 10000)}`;
    exists = await User.findOne({ username });
    counter++;
    if (counter > 20) break;
  }

  return username;
};
