import { Request, Response } from "express";
import Comment from "../models/Comment";

export const createComment = async (req: Request, res: Response) => {
  try {
    const { articleId, commentText, name, parentCommentId } = req.body;

    const comment = new Comment({
      article: articleId,
      commentText,
      name: name || "Anonymous",
      isAnonymous: !req.user,
    });

    if (req.user) {
      comment.user = req.user._id;
      comment.isAnonymous = false;
    }

    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      comment.parentComment = parentCommentId;
      await comment.save();
      parentComment.replies.push(comment._id);
      await parentComment.save();
    } else {
      await comment.save();
    }

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.find({
      article: articleId,
      parentComment: null,
    })
      .populate({
        path: "replies",
        populate: { path: "replies" },
      })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
