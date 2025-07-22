import {
  addToRecycleBin,
  approveArticle,
  createNews,
  deleteArticle,
  fetchAllNewsList,
  fetchApprovedNewsList,
  fetchDeletedArticles,
  fetchNewsList,
  fetchPendingNewsList,
  fetchRejectedNewsList,
  getArticleById,
  getCategories,
  getLastFiveLiveUpdateNewsType,
  getLiveUpdateHeadLine,
  getNewsById,
  getSubCat,
  getTypes,
  rejectArticle,
  restoreArticle,
  updateNews,
  videoUpload,
} from "@/services/news";
import { PaginationParams, queryClient } from "@/services/types";
import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";

interface UploadOptions {
  onUploadProgress?: (progress: number) => void;
}

interface FormDataWithProgress {
  formData: FormData;
  onUploadProgress?: (progress: number) => void;
}

export const useCreateNews = () => {
  return useMutation({
    mutationFn: async ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress?: (progress: number) => void;
    }) => {
      return createNews(formData, onUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useVideoUpload = () => {
  return useMutation({
    mutationFn: async ({
      formData,
      onUploadProgress,
    }: {
      formData: FormData;
      onUploadProgress?: (progress: number) => void;
    }) => {
      return videoUpload(formData, onUploadProgress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

// News Types Hook
export const useNewsTypes = () => {
  return useQuery({
    queryKey: ["newsTypes"],
    queryFn: getTypes,
    staleTime: 1000 * 60 * 5,
  });
};

// Live Update Types Hook
export const useLiveUpdateTypes = () => {
  return useQuery({
    queryKey: ["liveUpdateTypes"],
    queryFn: getLastFiveLiveUpdateNewsType,
  });
};

// Live Update Headline Hook
export const useLiveUpdateHeadline = (showHeadLine: string) => {
  return useQuery({
    queryKey: ["liveUpdateHeadline", showHeadLine],
    queryFn: () => getLiveUpdateHeadLine(showHeadLine),
    enabled: !!showHeadLine,
  });
};

// Paginated News Hooks
export const useNewsList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["newsList", params],
    queryFn: () => fetchNewsList(params),
  });
};

export const useAllNewsList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["allNewsList", params],
    queryFn: () => fetchAllNewsList(params),
  });
};

export const usePendingNewsList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["pendingNewsList", params],
    queryFn: () => fetchPendingNewsList(params),
  });
};

export const useRejectedNewsList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["rejectedNewsList", params],
    queryFn: () => fetchRejectedNewsList(params),
  });
};

export const useApprovedNewsList = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["approvedNewsList", params],
    queryFn: () => fetchApprovedNewsList(params),
  });
};

// News Approval Hooks
export const useApproveArticle = () => {
  return useMutation({
    mutationFn: (approvedItemId: string) => approveArticle(approvedItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useRejectArticle = () => {
  return useMutation({
    mutationFn: (rejectedItemId: string) => rejectArticle(rejectedItemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Single News Hooks
export const useArticleById = (id: string) => {
  return useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  });
};

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
};

// News Update Hook
export const useUpdateNews = () => {
  return useMutation({
    mutationFn: ({ id, newsData }: { id: string; newsData: FormData }) =>
      updateNews(id, newsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

// Recycle Bin Hooks
export const useAddToRecycleBin = () => {
  return useMutation({
    mutationFn: (id: string) => addToRecycleBin(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useDeletedArticles = (params: PaginationParams) => {
  return useQuery({
    queryKey: ["deletedArticles", params],
    queryFn: () => fetchDeletedArticles(params),
  });
};

export const useDeleteArticle = () => {
  return useMutation({
    mutationFn: (id: string) => deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};

export const useRestoreArticle = () => {
  return useMutation({
    mutationFn: (id: string) => restoreArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["news"] });
    },
  });
};
