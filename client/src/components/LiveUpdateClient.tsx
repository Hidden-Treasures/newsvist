"use client";

import socket from "@/app/lib/socket";
import Footer from "@/common/Footer";
import NewUpdateBanner from "@/common/NewUpdateBanner";
import FileDisplay from "@/helper/FileDisplay";
import TimeComponent from "@/helper/TimeComponent";
import {
  useAllLiveUpdates,
  useLiveUpdateNewsByType,
  useOldestLiveUpdateNewsArticle,
} from "@/hooks/useNews";
import React, { MouseEvent, useState } from "react";
import TextOnly from "./cards/TextOnly";
import Header from "@/common/header";
import { LiveNewsProps } from "@/app/live/[newsCategory]/live-news/[liveUpdateType]/[day]/[month]/[year]/page";
import Image from "next/image";
import { getLiveDateString } from "@/hooks/useDateString";
import { useProfileStore } from "@/store/profileStore";
import { useRouter } from "next/navigation";

const LiveUpdateClient = ({ params }: LiveNewsProps) => {
  const { newsCategory, liveUpdateType, day, month, year } = params || {};

  const date = year && month && day ? `${year}-${month}-${day}` : undefined;

  const [newUpdate, setNewUpdate] = useState(false);
  const [showFooterSearch, setShowFooterSearch] = useState(false);
  const router = useRouter();
  const setProfileUser = useProfileStore((state) => state.setProfileUser);

  const handleSearchButtonClick = () => {
    setShowFooterSearch(!showFooterSearch);
  };

  const { data: liveNews, refetch: allLiveUpdate } =
    useLiveUpdateNewsByType(liveUpdateType);
  const { data: oldestNews, refetch: oldestRefetch } =
    useOldestLiveUpdateNewsArticle(liveUpdateType);
  const { data: allLiveUpdates, refetch: allLiveUpdatesRefetch } =
    useAllLiveUpdates();

  socket.on("liveNewsUpdate", () => {
    allLiveUpdate();
    allLiveUpdatesRefetch();
    setNewUpdate(true);
  });

  const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const createdAt =
    Array.isArray(liveNews) && liveNews.length > 0
      ? liveNews[0].createdAt
      : null;

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

  const formatted = createdAt ? formatter.format(new Date(createdAt)) : null;
  // console.log("oldestNews::", oldestNews);

  const handleAuthorClick = () => {
    setProfileUser(oldestNews.user || oldestNews.editor || {});
    router.push(`/profiles/${oldestNews?.authorName}`);
  };

  return (
    <>
      <Header onSearchButtonClick={handleSearchButtonClick} />
      {!showFooterSearch && (
        <>
          <div className="mt-16 mx-12 flex">
            <div className="w-7/12 h-full ">
              <div className="flex items-center mb-3">
                <div className="red-dot" />{" "}
                <span className="tracking-wide font-bold text-xl ml-2">
                  {" "}
                  Live Update
                </span>
              </div>
              <h1 className="font-bold md:text-5xl text-base leading-tight ">
                <strong>{oldestNews?.liveUpdateHeadline}</strong>
              </h1>
              <div className="flex">
                <div className="md:w-10 md:h-10 w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={oldestNews?.user?.profilePhoto}
                    className="object cover w-full h-full"
                    alt="user img"
                    width={40}
                    height={40}
                  />
                </div>
                <div className="text-base text-gray-600 pl-2">
                  By{" "}
                  <span
                    className="underline cursor-pointer"
                    onClick={handleAuthorClick}
                  >
                    {oldestNews?.authorName}
                  </span>
                  {oldestNews?.editor?.username && (
                    <>
                      | Editor:{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={handleAuthorClick}
                      >
                        {oldestNews.editor.username}
                      </span>
                    </>
                  )}
                  , NEWSVIST
                </div>
              </div>
              <div className=" text-gray-400 mt-2 md:text-base text-sm">
                {" "}
                {formatted ? `Updated ${formatted}` : "Invalid date format"}
              </div>
            </div>
            <div className="w-5/12 h-full ">
              {" "}
              <div className=" relative w-full h-auto group mb-4 ">
                <FileDisplay file={oldestNews?.file} />

                <div className="mb-2 mt-2 font-bold text-xs text-gray-600 hover:underline">
                  {" "}
                  Catch up on previous global news
                </div>
                {allLiveUpdates
                  ?.slice(1, 7)
                  ?.map((item: any, index: number) => (
                    <TextOnly
                      key={`Live-${index}`}
                      link={`/live/${item?.newsCategory}/live-news/${
                        item?.liveUpdateType
                      }/${getLiveDateString(item?.createdAt)}`}
                      text={item?.title}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="mt-16 mx-12 flex md:flex-nowrap flex-wrap">
            <div className="md:w-4/12 w-full p-6 m-5 border-b border-t-4 border-t-red-600 border-l border-r rounded">
              <h1 className="text-2xl">What we covered here</h1>
              <div className="sticky top-16 h-screen">
                <ul className="mt-8 overflow-y-auto">
                  {liveNews?.map((item: any, index: number) => (
                    <a
                      key={index}
                      href={`#${item?._id}`}
                      className="cursor-pointer"
                      onClick={(e) => handleLinkClick(e, item?._id)}
                    >
                      <li className="list-disc mb-8 ">{item?.title}</li>
                    </a>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:w-8/12 w-full">
              <div className="border-b mr-5 ml-5 mb-5 mt-4">
                <div className="border-b-4 w-6 pl-1 border-b-red-600">All</div>
              </div>
              {liveNews?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    id={item?._id}
                    className=" p-6 m-5 border-b border-t border-l border-r rounded"
                  >
                    {" "}
                    <TimeComponent timestamp={item?.createdAt} />
                    <div className="text-3xl font-bold mb-4">{item?.title}</div>
                    <FileDisplay file={item?.file} />
                    <div
                      dangerouslySetInnerHTML={{ __html: item?.editorText }}
                    ></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <Footer />

      <NewUpdateBanner newUpdate={newUpdate} />
    </>
  );
};

export default LiveUpdateClient;
