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
