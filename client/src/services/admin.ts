import api from "@/app/lib/api";
import { RecentArticle } from "./types";

export const fetchDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export const fetchRecentArticles = async (): Promise<{
  articles: RecentArticle[];
}> => {
  const { data } = await api.get("/recent-articles");
  return data;
};
