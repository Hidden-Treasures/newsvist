import { NextFunction, Request, Response } from "express";

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
