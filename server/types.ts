import mongoose from "mongoose";

export interface GetNewsQuery {
  category?: string;
  subcategory?: string;
  type?: string;
  tags?: string;
  status?: string;
  page?: string;
  pageSize?: string;
  limit?: string;
  order?: "asc" | "desc";
  missedIt?: boolean;
  createdAt: Date | { $gte: Date; $lte?: Date };
  excludeIds?: string;
}

export interface NewsQuery {
  status?: string;
  isDeleted?: boolean;
  newsCategory?: string | { $regex: RegExp };
  subCategory?: string | { $regex: RegExp };
  category?: string | { $regex: RegExp };
  subcategory?: string | { $regex: RegExp };
  type?: string;
  tags?: { $in: mongoose.Types.ObjectId[] };
  [key: string]: any;
  _id?: { $nin: string[] };
  excludeIds?: string;
  missedIt?: boolean;
  createdAt?: Date | { $gte: Date; $lte?: Date };
}

export interface FileObject {
  url: string;
  public_id: string;
  responsive?: string[];
}
