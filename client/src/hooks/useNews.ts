import { CommentType } from "@/components/comment/Comment";
import {
  addComment,
  addReply,
  addToRecycleBin,
  approveArticle,
  createNews,
  deleteArticle,
  fetchAllLiveUpdates,
  fetchAllNewsList,
  fetchApprovedNewsList,
  fetchArticlesByCategory,
  fetchDeletedArticles,
  fetchLiveUpdateNewsByType,
  fetchNewsByTag,
  fetchNewsData,
  fetchNewsList,
  fetchOldestLiveUpdateNewsArticle,
  fetchPendingNewsList,
  fetchRejectedNewsList,
  getAdvertisements,
  getArticleBySlug,
  getCategories,
  getComments,
  getLastFiveLiveUpdateNewsType,
  getLiveUpdateHeadLine,
  getNewsAndBuzz,
  getNewsById,
  getRelatedNews,
  getSubCat,
  getTypes,
  getUpNextArticle,
  rejectArticle,
  restoreArticle,
  updateNews,
  videoUpload,
} from "@/services/news";
import {
  GetRelatedNewsParams,
  PaginationParams,
  queryClient,
  SearchParams,
  UseRelatedNewsResult,
} from "@/services/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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

// News Ads Hook
export const useNewsAds = () => {
  return useQuery({
    queryKey: ["newsAds"],
    queryFn: getAdvertisements,
    staleTime: 1000 * 60 * 5,
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
export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => getArticleBySlug(slug),
    enabled: !!slug,
    throwOnError: true,
  });
};

export const useUpNextArticle = (slug: string) => {
  return useQuery({
    queryKey: ["news", slug],
    queryFn: () => getUpNextArticle(slug),
    enabled: !!slug,
  });
};

export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: ["news", id],
    queryFn: () => getNewsById(id),
    enabled: !!id,
  });
};

export const useNewsAndBuzz = () => {
  return useQuery({
    queryKey: ["news"],
    queryFn: () => getNewsAndBuzz(),
  });
};
export const useRelatedNews = ({
  slug,
  tags,
  category,
}: GetRelatedNewsParams): UseRelatedNewsResult => {
  const queryKey = ["news", { slug, tags, category }];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getRelatedNews({ slug, tags, category }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error
      ? (error as any).message || "Error fetching related news"
      : null,
  };
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

export const useGetComments = (articleId: string) => {
  return useQuery<CommentType[]>({
    queryKey: ["comments", articleId],
    queryFn: () => getComments(articleId),
    staleTime: 0,
  });
};

export const usePostComment = (articleId: string) => {
  return useMutation({
    mutationFn: (commentText: string) => addComment({ articleId, commentText }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    },
  });
};

export const useReply = (articleId: string) => {
  return useMutation({
    mutationFn: (params: { replyText: string; parentCommentId: string }) =>
      addReply({
        articleId,
        commentText: params.replyText,
        parentCommentId: params.parentCommentId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", articleId] });
    },
  });
};

export const useArticlesByCategory = (params: {
  category?: string;
  subcategory?: string;
  limit?: number;
  order?: string;
  tags?: string;
  type?: string;
  excludeIds?: string;
}) => {
  return useQuery({
    queryKey: ["articles-by-category", params],
    queryFn: () => fetchArticlesByCategory(params),
    enabled: !!params.category || !!params.subcategory,
  });
};

export const useSearch = (params: SearchParams) => {
  return useQuery({
    queryKey: ["search", params.searchText, params.page],
    queryFn: () => fetchNewsData(params),
    enabled: !!params.searchText,
  });
};

export const useNewsByTag = (tag: string, page = 1) => {
  return useQuery({
    queryKey: ["newsByTag", tag, page],
    queryFn: () => fetchNewsByTag(tag, page),
    enabled: !!tag,
  });
};

export const useLiveUpdateNewsByType = (liveUpdateType: string) => {
  return useQuery({
    queryKey: ["liveUpdateNews", liveUpdateType],
    queryFn: () => fetchLiveUpdateNewsByType(liveUpdateType),
    enabled: !!liveUpdateType,
  });
};

export const useOldestLiveUpdateNewsArticle = (liveUpdateType: string) => {
  return useQuery({
    queryKey: ["oldestLiveUpdateNewsArticle", liveUpdateType],
    queryFn: () => fetchOldestLiveUpdateNewsArticle(liveUpdateType),
    enabled: !!liveUpdateType,
  });
};

export const useAllLiveUpdates = () => {
  return useQuery({
    queryKey: ["allLiveUpdates"],
    queryFn: fetchAllLiveUpdates,
  });
};
