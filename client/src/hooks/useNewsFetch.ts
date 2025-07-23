import { useQuery } from "@tanstack/react-query";
import api from "@/app/lib/api";

interface UseNewsFetchParams {
  category?: string;
  subcategory?: string;
  liveUpdateType?: string;
  tags?: string[];
  limit?: number;
  order?: string;
  type?: string;
  excludeIds?: string[];
}

interface UseNewsFetchResult {
  data: any[];
  loading: boolean;
  error: string | null;
}

export default function useNewsFetch({
  category,
  subcategory,
  liveUpdateType,
  tags,
  limit,
  order,
  type,
  excludeIds,
}: UseNewsFetchParams): UseNewsFetchResult {
  const queryKey = [
    "news",
    {
      category,
      subcategory,
      liveUpdateType,
      tags,
      type,
      limit,
      order,
      excludeIds,
    },
  ];

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: Record<string, any> = {};
      if (excludeIds?.length) {
        params.excludeIds = excludeIds.join(",");
      }

      if (category) {
        params.category = category;
        if (subcategory) {
          params.subcategory = subcategory;
        }
      }

      if (liveUpdateType) {
        params.liveUpdateType = liveUpdateType;
      }
      if (type) {
        params.type = type;
      }
      if (tags) {
        params.tags = tags.join(",");
      }

      if (limit) {
        params.limit = limit;
      }

      if (order) {
        params.order = order;
      }

      const response = await api.get("/news", { params });
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });

  return {
    data: data || [],
    loading: isLoading,
    error: error ? (error as any).message || "Error fetching data" : null,
  };
}
