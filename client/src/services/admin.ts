import api from "@/app/lib/api";
import { RecentArticle } from "./types";

export const fetchDashboardStats = async () => {
  const { data } = await api.get("/admin-dashboard/stats");
  return data;
};

export const fetchRecentArticles = async (): Promise<{
  articles: RecentArticle[];
}> => {
  const { data } = await api.get("/admin-recent-articles");
  return data;
};
export const getEditorDashboardStats = async () => {
  const { data } = await api.get("/editor-dashboard/stats");
  return data;
};
export const getEditorRecentArticles = async (): Promise<{
  articles: RecentArticle[];
}> => {
  const { data } = await api.get("/editor-recent-articles");
  return data;
};
