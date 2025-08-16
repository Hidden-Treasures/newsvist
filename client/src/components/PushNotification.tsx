"use client";

import { usePushSubscription } from "@/hooks/usePush";
import { PushSubscriptionPayload } from "@/services/types";
import React, { useEffect, useState } from "react";
import { Bell, Settings } from "react-feather";
import { toast } from "react-toastify";

const PUBLIC_VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
};

const categoriesList = [
  "World",
  "Politics",
  "Business",
  "Health",
  "Entertainment",
  "Tech",
  "Style",
  "Travel",
  "Sports",
  "Science",
];

const PushNotification = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { mutate: subscribeToPush, isPending } = usePushSubscription();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(async (reg) => {
          console.log("Service Worker registered:", reg);

          // Check if already subscribed
          const existingSub = await reg.pushManager.getSubscription();
          if (existingSub) {
            setIsSubscribed(true);
            console.log("Already subscribed:", existingSub);
          }
        })
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, []);

  const handleSubscribe = async (categories?: string[]) => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("You must allow notifications to subscribe.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      const raw = subscription.toJSON();

      const payload: PushSubscriptionPayload = {
        endpoint: raw.endpoint!,
        expirationTime: raw.expirationTime ?? null,
        keys: {
          p256dh: raw.keys?.p256dh ?? "",
          auth: raw.keys?.auth ?? "",
        },
        categories:
          categories && categories.length > 0 ? categories : ["BreakingNews"],
      };

      subscribeToPush(payload, {
        onSuccess: () => {
          setIsSubscribed(true);
          toast.success(
            "You’ve successfully subscribed to Newsvist alerts. Stay tuned for the latest updates!"
          );
          setShowPrefs(false);
        },
        onError: (err: any) => console.error("Subscription failed:", err),
      });
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      {!isSubscribed && (
        <div className="fixed top-6 left-6 z-40 max-w-sm">
          <div className="relative rounded-2xl shadow-lg p-5 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400 text-white backdrop-blur-md">
            {/* Bell Icon */}
            <Bell className="w-7 h-7 mb-2 opacity-90" />

            {/* Tagline */}
            <p className="text-center text-sm font-light leading-snug mb-3">
              Stay informed with the latest updates from{" "}
              <span className="font-semibold">NEWSVIST</span>.
            </p>

            {/* CTA as subtle text */}
            <p
              onClick={() => !isSubscribed && !isPending && handleSubscribe()}
              className={`text-xs underline cursor-pointer transition ${
                isSubscribed
                  ? "text-green-200 cursor-default"
                  : isPending
                  ? "text-gray-300 cursor-wait"
                  : "hover:text-white/90 text-white/80"
              }`}
            >
              {isSubscribed
                ? "🔔 You’re subscribed to alerts"
                : isPending
                ? "Subscribing..."
                : "Enable breaking news alerts"}
            </p>

            {/* Manage Preferences */}
            <button
              onClick={() => setShowPrefs(true)}
              className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-white/70 hover:text-white cursor-pointer transition"
            >
              <Settings size={13} />
              Preferences
            </button>
          </div>
          {/* Preference Modal */}
          {showPrefs && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm animate-fadeIn">
              <div className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl p-6 w-[420px] animate-slideUp">
                {/* Close button */}
                <button
                  onClick={() => setShowPrefs(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  Personalize Your News
                </h2>
                <p className="text-sm text-gray-500 mb-5">
                  Select categories that matter most to you. You’ll only get
                  alerts for what you care about.
                </p>

                {/* Category pills */}
                <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {categoriesList.map((cat) => (
                    <label
                      key={cat}
                      className={`px-3 py-2 rounded-lg border text-sm cursor-pointer flex items-center gap-2 transition 
              ${
                selectedCategories.includes(cat)
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowPrefs(false)}
                    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSubscribe(selectedCategories)}
                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-md transition cursor-pointer"
                  >
                    {isPending ? "Subscribing..." : "Save & Subscribe"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default PushNotification;
