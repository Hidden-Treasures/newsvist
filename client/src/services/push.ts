import api from "@/app/lib/api";
import { PushSubscriptionPayload } from "./types";

export const subscribeToPushService = async (
  subscription: PushSubscriptionPayload
) => {
  const { data } = await api.post("/subscribe", subscription);
  return data;
};
