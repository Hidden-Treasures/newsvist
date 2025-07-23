import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export interface PaginationParams {
  currentPage: number;
  itemsPerPage: number;
}

export interface CreateNewsResponse {
  success?: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}

export interface APIResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  [key: string]: any;
}

export interface SubCategory {
  _id: string;
  name: string;
}

export interface Category {
  _id: string;
  title: string;
  items?: SubCategory[];
}

export interface AddCategoryData {
  categoryName: string;
  subcategoryName: string;
  selectedParentCategory: string;
}

export interface UpdateCategoryData {
  categoryId: string;
  categoryName: string;
}

export interface UpdateSubCategoryData {
  categoryId: string;
  subcategoryId: string;
  subcategoryName: string;
}

export interface TypeItem {
  _id: string;
  name: string;
}

export interface News {
  _id: string;
  title: string;
  name: string | null;
  slug: string | null;
  newsCategory: string;
  subCategory: string;
  tags: string[];
  liveUpdateType: string;
  file: {
    url: string;
    public_id: string;
    responsive: string[];
  };
  video?: {
    url: string;
    public_id: string;
  };
  createdAt: string;
}

export interface RelatedNewsResponse {
  relatedNews: News[];
}

export interface GetRelatedNewsParams {
  slug: string;
  tags: string[];
  category: string;
}

export interface UseRelatedNewsResult {
  data: News[];
  loading: boolean;
  error: string | null;
}
