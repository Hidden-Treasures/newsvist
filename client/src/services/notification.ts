import api from "@/app/lib/api";

export const fetchNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const markNotificationAsRead = async (id: string) => {
  await api.patch(`/notifications/${id}/read`);
};
