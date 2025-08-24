import { fetchDashboardStats, fetchRecentArticles } from "@/services/admin";
import { RecentArticle } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60,
  });
};

export const useRecentArticles = () => {
  return useQuery<RecentArticle[]>({
    queryKey: ["recent-articles"],
    queryFn: async () => {
      const data = await fetchRecentArticles();
      return data.articles;
    },
  });
};
