import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";

interface VideoObject {
  url: string;
  public_id: string;
}

export const validateNews = [
  check("title").trim().not().isEmpty().withMessage("News title is missing!"),
];

export const validateVideo = check("video")
  .isObject()
  .withMessage("Video must be an object with url and public_id")
  .custom(({ url, public_id }: VideoObject) => {
    try {
      const result = new URL(url);
      if (!result.protocol.includes("http"))
        throw Error("Video url is invalid!");

      const arr = url.split("/");
      const publicId = arr[arr.length - 1].split(".")[0];

      if (public_id !== publicId) throw Error("Video public_id is invalid!");

      return true;
    } catch (error) {
      throw Error("Video url is invalid!");
    }
  });

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const error = validationResult(req).array();
  if (error.length) {
    return res.json({ error: error[0].msg });
  }

  next();
};

export const commentValidation = [
  check("articleId").notEmpty().withMessage("Article ID is required"),
  check("commentText").notEmpty().withMessage("Comment text is required"),
  check("parentCommentId")
    .optional()
    .isMongoId()
    .withMessage("Invalid parent comment ID"),
];
