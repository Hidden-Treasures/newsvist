import { QueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

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
  slug?: string;
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
  authorName: string | null;
  editorText: string | null;
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
  deletedAt: string;
}
export interface SearchParams {
  searchText: string;
  page?: number;
  pageSize?: number;
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

export interface GetArticlesQuery {
  category?: string;
  subcategory?: string;
  limit?: number;
  order?: string;
  tags?: string;
  type?: string;
  excludeIds?: string;
}

export interface NewsTableProps {
  data: News[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  afterDelete: (data?: News[]) => void;
  afterUpdate: (news?: News) => void;
}

export interface Biography {
  _id: string;
  realName: string;
  stageName?: string;
  aliasName?: string;
  dateOfBirth?: string;
  hometown?: string;
  category: "Music Artist" | "Footballer" | "Influencer" | "Creator";
  label?: string;
  position?: string;
  niche?: string;
  genre?: string;
  club?: string;
  platform?: string;
  socialMedia?: Record<string, string>;
  bio: string;
  nationality?: string;
  gender?: string;
  occupations?: string[];
  education?: string[];
  awards?: string[];
  notableWorks?: string[];
  spouse?: string;
  children?: string[];
  website?: string;
  wikipedia?: string;
  activeYears?: string;
  placeOfBirth?: string;
  placeOfDeath?: string;
  quotes?: string[];
  references?: string[];
  image?: string;
}

export interface BioFormProps {
  biographyData: Biography | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<any>;
}

export interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
  categories: string[];
}

export interface GroupedMatchesResponse {
  success: boolean;
  message?: string;
  groupedMatches: Record<string, Record<string, any[]>>;
}

export type LiveEvent = {
  _id: string;
  liveUpdateType: string;
  title: string;
  headline: string;
  createdAt: string;
  updatedAt: string;
};

export type LiveEntry = {
  _id: string;
  event: LiveEvent;
  title: string;
  content: string;
  author?: {
    _id: string;
    username: string;
    profilePhoto?: string;
  };
  file?: {
    url: string;
    public_id: string;
    responsive: string[];
  };
  video?: {
    url: string;
    public_id: string;
  };

  createdAt: string;
  updatedAt: string;
};

export type GetLiveEventEntriesResponse = {
  event: LiveEvent;
  entries: LiveEntry[];
};
