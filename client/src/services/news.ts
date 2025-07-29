import api from "@/app/lib/api";
import { AxiosError, AxiosProgressEvent, AxiosResponse } from "axios";
import {
  APIResponse,
  Category,
  CreateNewsResponse,
  GetArticlesQuery,
  GetRelatedNewsParams,
  News,
  PaginationParams,
  RelatedNewsResponse,
  SearchParams,
} from "./types";
import { CommentType } from "@/components/comment/Comment";

type progressCallback = (progress: number) => void;

export const createNews = async (
  formData: FormData,
  onUploadProgress?: progressCallback
): Promise<CreateNewsResponse> => {
  try {
    const { data } = await api.post<CreateNewsResponse>(
      "/create-news",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const percentCompleted = Math.floor(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onUploadProgress(percentCompleted);
          }
        },
      }
    );

    return data;
  } catch (error: any) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || String(error) };
  }
};

export const videoUpload = async (
  videoData: FormData,
  onUploadProgress?: progressCallback
): Promise<APIResponse> => {
  try {
    const { data } = await api.post<APIResponse>("/upload-video", videoData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: ({ loaded, total }: AxiosProgressEvent) => {
        if (onUploadProgress && total) {
          onUploadProgress(Math.floor((loaded / total) * 100));
        }
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// getSubCat
export const getSubCat = async (
  selectedNewsCategory: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.get(
      `/getsubcategories/${selectedNewsCategory}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// addTypes
export const addType = async (name: string) => {
  try {
    const { data } = await api.post(
      "/addType",
      { name },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    const { response } = error;
    if (response?.data) return response.data;

    return { error: error.message || error };
  }
};

// getTypes
export const getTypes = async () => {
  try {
    const { data } = await api.get("/types", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// deleteType
export const deleteType = async (TypeId: string) => {
  try {
    const { data } = await api.delete(`/deleteType/${TypeId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// addCategories
export const addCategories = async (
  name: string,
  subcategories: string[],
  parentCategory: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.post(
      "/addCategories",
      { name, subcategories, parentCategory },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// updateCategory
export const updateCategory = async (
  categoryId: string,
  categoryName: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.put(
      `/updateCategory/${categoryId}`,
      { categoryName },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// updateSubCat
export const updateSubCat = async (
  categoryId: string,
  subcategoryId: string,
  subcategoryName: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.put(
      `/updateSubCategory/${categoryId}/subcategory/${subcategoryId}`,
      { subcategoryName },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      success: data.success,
      message: data.message,
      data: data.data,
    };
  } catch (error: any) {
    return handleError(error);
  }
};

// getCategories
export const getCategories = async (): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/getAllNewsCategories", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// getCategoriesWithSub
export const getCategoriesWithSub = async (): Promise<Category[]> => {
  try {
    const { data } = await api.get("/categories-and-sub", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data ?? [];
  } catch (error: any) {
    return [];
  }
};

// deleteCategory
export const deleteCategory = async (
  categoryId: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.delete(`/deleteCategories/${categoryId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// deleteSubCat
export const deleteSubCat = async (
  categoryId: string,
  subcategoryId: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.delete(
      `/categories/${categoryId}/subcategories/${subcategoryId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// getLastFiveLiveUpdateNewsType
export const getLastFiveLiveUpdateNewsType = async (): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/getLastFiveLiveUpdateNewsType", {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

// getLiveUpdateHeadLine
export const getLiveUpdateHeadLine = async (
  showHeadLine: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.get(`/getHeadline/${showHeadLine}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return data;
  } catch (error: any) {
    return handleError(error);
  }
};

export const fetchNewsList = async ({
  currentPage,
  itemsPerPage,
}: PaginationParams): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/newsList", {
      withCredentials: true,
      params: { page: currentPage + 1, pageSize: itemsPerPage },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchAllNewsList = async ({
  currentPage,
  itemsPerPage,
}: PaginationParams): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/allNewsList", {
      withCredentials: true,
      params: { page: currentPage + 1, pageSize: itemsPerPage },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchPendingNewsList = async ({
  currentPage,
  itemsPerPage,
}: PaginationParams): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/pending", {
      withCredentials: true,
      params: { page: currentPage + 1, pageSize: itemsPerPage },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchRejectedNewsList = async ({
  currentPage,
  itemsPerPage,
}: PaginationParams): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/rejected", {
      withCredentials: true,
      params: { page: currentPage + 1, pageSize: itemsPerPage },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchApprovedNewsList = async ({
  currentPage,
  itemsPerPage,
}: PaginationParams): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/approved", {
      withCredentials: true,
      params: { page: currentPage + 1, pageSize: itemsPerPage },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const approveArticle = async (
  approvedItemId: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.put(
      `/approve/${approvedItemId}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const rejectArticle = async (
  rejectedItemId: string
): Promise<APIResponse> => {
  try {
    const { data } = await api.put(
      `/reject/${rejectedItemId}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getUpNextArticle = async (slug: string): Promise<APIResponse> => {
  try {
    const { data } = await api.get(`/up-next/${slug}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    console.log("🚀 ~ getUpNextArticle ~ data:", data);
    return data.upNextArticles;
  } catch (error) {
    return handleError(error);
  }
};
export const getArticleBySlug = async (slug: string): Promise<APIResponse> => {
  try {
    const { data } = await api.get(`/getNewsBySlug/${slug}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getNewsById = async (id: string): Promise<APIResponse> => {
  try {
    const { data } = await api.get(`/getNewsByID/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getNewsAndBuzz = async () => {
  try {
    const response = await api.get(`/news-and-buzz`);
    return response?.data?.newsAndBuzz;
  } catch (error) {
    return handleError(error);
  }
};
export const getRelatedNews = async ({
  slug,
  tags,
  category,
}: GetRelatedNewsParams): Promise<News[]> => {
  try {
    const response: AxiosResponse<RelatedNewsResponse> = await api.get(
      "/related-news",
      {
        params: {
          slug,
          tags: tags.join(","),
          category,
        },
      }
    );
    return response.data.relatedNews ?? [];
  } catch (error: any) {
    console.error(
      "Error fetching related news:",
      error.response?.data || error.message
    );
    return [];
  }
};

export const updateNews = async (
  id: string,
  newsData: FormData
): Promise<APIResponse> => {
  try {
    const { data } = await api.patch(`/update/${id}`, newsData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const getNewsForUpdate = async (id: string): Promise<APIResponse> => {
  try {
    const { data } = await api.get(`/for-update/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const addToRecycleBin = async (id: string): Promise<APIResponse> => {
  try {
    const { data } = await api.delete(`/recycle-bin/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const fetchDeletedArticles = async ({
  currentPage,
  itemsPerPage,
}: PaginationParams): Promise<APIResponse> => {
  try {
    const { data } = await api.get("/recycle-bin", {
      withCredentials: true,
      params: { page: currentPage + 1, pageSize: itemsPerPage },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteArticle = async (id: string): Promise<APIResponse> => {
  try {
    const { data } = await api.delete(`/news/${id}`, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error) {
    return handleError(error);
  }
};

export const restoreArticle = async (id: string): Promise<APIResponse> => {
  try {
    const { data } = await api.patch(
      `/news/restore/${id}`,
      {},
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return data;
  } catch (error) {
    return handleError(error);
  }
};

// add comment
export const addComment = async ({
  articleId,
  commentText,
}: {
  articleId: string;
  commentText: string;
}) => {
  const response = await api.post("/comment", { articleId, commentText });
  return response.data;
};

// get comment
export const getComments = async (
  articleId: string
): Promise<CommentType[]> => {
  const response = await api.get(`/comments/${articleId}`);
  return response.data;
};

// add reply
export const addReply = async ({
  articleId,
  commentText,
  parentCommentId,
}: {
  articleId: string;
  commentText: string;
  parentCommentId: string;
}) => {
  const response = await api.post("/comment", {
    articleId,
    commentText,
    parentCommentId,
  });
  return response.data;
};

export const fetchArticlesByCategory = async (
  params: GetArticlesQuery
): Promise<News[]> => {
  const response = await api.get("/articles/by-category", { params });
  return response.data;
};

export const fetchNewsData = async ({
  searchText,
  page = 1,
  pageSize = 5,
}: SearchParams) => {
  const response = await api.get("/main-search", {
    params: { q: searchText, page, pageSize },
  });

  return {
    news: response.data.news,
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
};

export const fetchNewsByTag = async (tag: string, page = 1, limit = 10) => {
  const response = await api.get(`/news-by-tags`, {
    params: {
      tags: tag,
      page,
      limit,
    },
  });
  return response.data;
};

// Common error handler
function handleError(error: any): APIResponse {
  const axiosError = error as AxiosError;
  if (axiosError.response?.data) return axiosError.response.data as APIResponse;
  return { error: axiosError.message || String(error) };
}
