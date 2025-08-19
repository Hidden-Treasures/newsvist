"use client";

import socket from "@/app/lib/socket";
import Footer from "@/common/Footer";
import NewUpdateBanner from "@/common/NewUpdateBanner";
import FileDisplay from "@/helper/FileDisplay";
import TimeComponent from "@/helper/TimeComponent";
import { useLiveEventEntries, useLiveEvents } from "@/hooks/useNews";
import React, { useEffect, useState } from "react";
import Header from "@/common/header";
import Image from "next/image";
import { getLiveDateString } from "@/hooks/useDateString";
import { useRouter } from "next/navigation";
import { LiveNewsProps } from "@/app/live-news/[liveUpdateType]/[day]/[month]/[year]/page";
import { LiveEntry } from "@/services/types";
import LiveText from "./cards/LiveText";

const LiveUpdateClient = ({ params }: LiveNewsProps) => {
  const { liveUpdateType } = params || {};

  const router = useRouter();
  const [newUpdate, setNewUpdate] = useState(false);
  const [showFooterSearch, setShowFooterSearch] = useState(false);

  const { data: liveEventData, refetch: refetchLiveEvent } =
    useLiveEventEntries(liveUpdateType);
  const { data: allLiveUpdates, refetch: refetchAllLiveUpdates } =
    useLiveEvents();

  const liveNews = liveEventData?.entries || [];
  const oldestNews = liveNews?.[0];

  useEffect(() => {
    socket.on("liveNewsUpdate", () => {
      refetchLiveEvent();
      refetchAllLiveUpdates();
      setNewUpdate(true);
    });

    return () => {
      socket.off("liveNewsUpdate");
    };
  }, [refetchLiveEvent, refetchAllLiveUpdates]);

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formatted = oldestNews?.createdAt
    ? formatter.format(new Date(oldestNews.createdAt))
    : null;

  return (
    <>
      <Header
        onSearchButtonClick={() => setShowFooterSearch(!showFooterSearch)}
      />

      {!showFooterSearch && (
        <main className="mt-16 px-4 md:px-12 flex flex-col md:flex-row gap-8">
          {/* Left Column: Main Headline */}
          <div className="md:w-7/12 w-full">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-red-500">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="uppercase font-bold text-white tracking-wider text-sm">
                Live Updates
              </span>
            </div>

            <h1 className="font-extrabold text-2xl md:text-4xl leading-snug mb-4">
              {oldestNews?.event?.headline || oldestNews?.title || "Loading..."}
            </h1>

            {/* Authors Section */}
            {liveNews.length > 0 && (
              <div className="flex items-center gap-2 mb-4 flex-wrap text-gray-600 text-sm md:text-base">
                {/* Author profile pictures */}
                <div className="flex -space-x-2">
                  {Array.from(
                    new Map(
                      liveNews
                        .map((entry) => entry.author)
                        .filter(
                          (
                            author
                          ): author is {
                            _id: string;
                            username: string;
                            profilePhoto?: string;
                          } => !!author
                        )
                        .map((author) => [author._id, author])
                    ).values()
                  ).map((author) => (
                    <div
                      key={author._id}
                      className="w-8 h-8 rounded-full overflow-hidden border-2 border-white cursor-pointer"
                      onClick={() =>
                        router.push(`/profiles/${author.username}`)
                      }
                    >
                      <Image
                        src={author.profilePhoto ?? ""}
                        alt={author.username}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>

                {/* Author names */}
                <div className="ml-2">
                  By{" "}
                  {Array.from(
                    new Map(
                      liveNews
                        .map((entry) => entry.author)
                        .filter(
                          (
                            author
                          ): author is {
                            _id: string;
                            username: string;
                            profilePhoto?: string;
                          } => !!author
                        )
                        .map((author) => [author._id, author])
                    ).values()
                  ).map((author: any, idx, arr) => (
                    <span key={author._id}>
                      <span
                        className="underline cursor-pointer hover:text-red-600"
                        onClick={() =>
                          router.push(`/profiles/${author.username}`)
                        }
                      >
                        {author.username}
                      </span>
                      {idx < arr.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  , NEWSVIST
                </div>

                {/* Timestamp */}
                <div className="ml-2 text-gray-400">Updated {formatted}</div>
              </div>
            )}

            {/* Previous Live Updates */}
            <div className="mb-8">
              <h2 className="font-semibold text-lg mb-3">Previous Updates</h2>
              <div className="flex flex-col gap-2">
                {allLiveUpdates?.slice(1, 7).map((item, index) => (
                  <LiveText
                    key={index}
                    link={`/live-news/${
                      item?.liveUpdateType
                    }/${getLiveDateString(item?.createdAt)}`}
                    text={item?.headline}
                    timestamp={new Date(item?.createdAt).toLocaleTimeString(
                      [],
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Timeline */}
          <div className="md:w-5/12 w-full flex flex-col">
            <div className="sticky top-24 overflow-y-auto max-h-[80vh] p-4 border-l border-gray-200 space-y-6 hide-scrollbar">
              {liveNews?.map((item: LiveEntry, index: number) => (
                <div key={index} id={item?._id} className="mb-4">
                  <TimeComponent timestamp={item?.createdAt} />
                  <h3 className="font-bold text-xl mb-2">{item?.title}</h3>
                  <FileDisplay file={item?.file || null} />
                  <p className="text-base leading-relaxed mt-4 mb-6">
                    <span
                      style={{ whiteSpace: "pre-line" }}
                      className="[&>*]:m-0 [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer hover:[&_a]:text-blue-800 prose prose-sm md:prose md:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html: item?.content.replace(/^<p>|<\/p>$/g, ""),
                      }}
                    />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      <Footer />
      <NewUpdateBanner newUpdate={newUpdate} />
    </>
  );
};

export default LiveUpdateClient;
