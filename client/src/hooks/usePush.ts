import { subscribeToPushService } from "@/services/push";
import { PushSubscriptionPayload } from "@/services/types";
import { useMutation } from "@tanstack/react-query";

export const usePushSubscription = () => {
  return useMutation({
    mutationFn: (subscription: PushSubscriptionPayload) =>
      subscribeToPushService(subscription),
  });
};
