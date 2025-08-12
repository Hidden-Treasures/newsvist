import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/helper";
import jwt = require("jsonwebtoken");

export const isAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies.authToken;

  if (!token) return sendError(res, "Unauthorized!");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error in isAuth middleware:", error);
    return sendError(res, "Internal server error");
  }
};

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    const userId = (user as any)._id;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized User" });
    }

    res.status(200).json({
      user: {
        _id: userId,
        token: req.cookies.authToken,
        role: user.role,
        username: user.username,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error in checkAuth middleware:", error);
    return sendError(res, "Internal server error");
  }
};

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (user.role !== "admin") return sendError(res, "unauthorized access!");
  next();
};
export const isEditor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (user.role !== "editor") return sendError(res, "unauthorized access!");
  next();
};
export const isJournalist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  if (user.role !== "journalist") return sendError(res, "unauthorized access!");
  next();
};

export const canCreateRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user } = req;
  try {
    switch (user.role) {
      case "admin":
        next();
        break;
      case "journalist":
        next();
        break;
      default:
        return res.status(403).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
  }
};

export const isRole = (role: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
};
