import MidCard from "@/components/cards/MidCard";
import TextOnly from "@/components/cards/TextOnly";
import FileDisplay from "@/helper/FileDisplay";
import TextError from "@/helper/TextError";
import TextLoader from "@/helper/TextLoader";
import VideoDisplay from "@/helper/VideoDisplay";
import getDateString, { getLiveDateString } from "@/hooks/useDateString";
import { useLiveEventEntries, useLiveEvents } from "@/hooks/useNews";
import useNewsFetch from "@/hooks/useNewsFetch";
import { LiveEntry } from "@/services/types";
import Link from "next/link";
import React, { FC, useMemo } from "react";

const FirstSection: FC = () => {
  const { data: liveEvents = [], isLoading: loadingLiveEvents } =
    useLiveEvents();

  const liveEntriesHooks = [
    useLiveEventEntries(liveEvents[0]?.liveUpdateType),
    useLiveEventEntries(liveEvents[1]?.liveUpdateType),
    useLiveEventEntries(liveEvents[2]?.liveUpdateType),
  ];

  const liveEntries: LiveEntry[] = liveEntriesHooks
    .map((hook) => hook.data?.entries?.[0])
    .filter(Boolean) as LiveEntry[];

  const {
    data: midCards = [],
    loading: loading1,
    error: error1,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "General",
    tags: undefined,
    limit: 3,
    order: "desc",
  });

  const excludedFromMidCards = useMemo(
    () => midCards.map((article) => article._id),
    [midCards]
  );

  const {
    data: breaking = [],
    loading: loading2,
    error: error2,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "Breaking",
    tags: undefined,
    limit: 2,
    order: "desc",
    excludeIds: excludedFromMidCards,
  });

  const excludedFromBreaking = useMemo(
    () => [...excludedFromMidCards, ...breaking.map((article) => article._id)],
    [excludedFromMidCards, breaking]
  );

  const {
    data: breakingNews = [],
    loading: loadingBreakingNews,
    error: errorBreakingNews,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "Breaking",
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromBreaking,
  });

  const excludedFromBreakingNews = useMemo(
    () => [
      ...excludedFromBreaking,
      ...(breakingNews?.map((article) => article._id) || []),
    ],
    [excludedFromBreaking, breakingNews]
  );

  const {
    data: textOnly = [],
    loading: loading3,
    error: error3,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "General",
    tags: undefined,
    limit: 6,
    order: "desc",
    excludeIds: excludedFromBreakingNews,
  });

  const excludedFromTextOnly = useMemo(
    () => [
      ...excludedFromBreakingNews,
      ...(textOnly?.map((article) => article._id) || []),
    ],
    [excludedFromBreakingNews, textOnly]
  );

  const {
    data: liveUpdate = [],
    loading: loading4,
    error: error4,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "LiveUpdate",
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromTextOnly,
  });

  const midCardsList = midCards.slice(0, 1);
  const midCardsVisual = midCards.slice(1);

  // console.log("liveUpdate[0]::", liveUpdate[0]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Section */}
      {breaking?.length > 1 && (
        <div className="w-full md:w-2/3 p-4">
          <Link
            href={`/${
              breaking?.length > 1 &&
              `${getDateString(breaking[1]?.createdAt).replace(/\//g, "/")}/${
                breaking[1]?.newsCategory
              }/${breaking[1]?.slug}`
            }`}
          >
            <div className="max-w-screen-md mx-auto p-8">
              <h1 className="md:text-5xl font-bold mb-4 text-black text-center hover:underline">
                {loading2 ? (
                  <TextLoader className="mx-auto text-center !bg-transparent" />
                ) : breaking && breaking.length > 1 ? (
                  breaking[1]?.title
                ) : error2 ? (
                  <TextError className="mx-auto text-center" />
                ) : (
                  ""
                )}
              </h1>
              <div className="max-w-screen-md mx-auto mb-3">
                <div className="aspect-w-16 aspect-h-9">
                  {breaking?.length > 1 && breaking[1]?.video ? (
                    <VideoDisplay
                      image={breaking[1]?.file}
                      video={breaking[1]?.video}
                      className="h-64 object-cover transition-transform transform group-hover:scale-100 hover:opacity-50"
                    />
                  ) : (
                    <FileDisplay file={breaking[1]?.file} />
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="w-full md:w-2/3 p-4">
        <ul className="px-5">
          {textOnly?.length > 0 && (
            <li className="list-disc text-[1.02rem] my-3 hover:underline">
              <Link
                href={`/${getDateString(textOnly[0]?.createdAt).replace(
                  /\//g,
                  "/"
                )}/${textOnly[0]?.newsCategory}/${textOnly[0]?.slug}`}
              >
                {loading3 ? (
                  <TextLoader className="mx-auto text-center !bg-transparent" />
                ) : (
                  textOnly[0]?.title
                )}
              </Link>
            </li>
          )}

          {liveEntries.length > 0 &&
            liveEntries.map((entry, index) => (
              <li
                key={`live-text-${index}`}
                className="list-disc text-[1.02rem] my-3"
              >
                <div>
                  <span className="text-red-600 font-bold text-[1rem]">
                    Live Update:{" "}
                  </span>
                  <Link
                    href={`/live-news/${
                      entry.event.liveUpdateType
                    }/${getLiveDateString(entry.createdAt)}`}
                    className="hover:underline"
                  >
                    {entry.title}
                  </Link>
                </div>
              </li>
            ))}

          {midCardsList?.map((newsItem, index) => (
            <li className="list-disc my-3">
              <Link
                href={`/${getDateString(newsItem?.createdAt).replace(
                  /\//g,
                  "/"
                )}/${newsItem?.newsCategory}/${newsItem?.slug}`}
                key={index}
                className="hover:underline"
              >
                {loading1 ? (
                  <TextLoader className="mx-auto text-center !bg-transparent" />
                ) : (
                  newsItem?.title
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mid Section */}
      <div className="w-full md:!w-1/3 p-4 ">
        {midCardsVisual?.length > 0 &&
          midCardsVisual?.map((card, index) => (
            <MidCard
              key={`cat1-${index}`}
              link={`/${getDateString(card?.createdAt).replace(/\//g, "/")}/${
                card?.newsCategory
              }/${card?.slug}`}
              imageSrc={card?.file}
              video={card?.video}
              text={card?.title}
              loading={loading3}
              db={true}
            />
          ))}
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/3 p-4 ">
        <Link
          href={`/${
            breakingNews?.length > 0
              ? `${getDateString(breakingNews[0]?.createdAt).replace(
                  /\//g,
                  "/"
                )}/${breakingNews[0]?.newsCategory}/${breakingNews[0]?.slug}`
              : ""
          }`}
          className="relative w-305 h-171 group mb-4"
        >
          <>
            {breakingNews?.length >= 0 && breakingNews[0]?.video && (
              <VideoDisplay
                image={breakingNews[0]?.file}
                video={breakingNews[0]?.video}
                playVideo={true}
                className="h-44 object-cover transition-transform transform group-hover:scale-100"
              />
            )}
          </>
        </Link>
        <div>
          {textOnly?.length > 0 && (
            <div className="mb-2 mt-4 font-bold text-[19px] hover:underline">
              Catch up on today's global news
            </div>
          )}

          <div>
            {textOnly?.map((card, index) => (
              <TextOnly
                key={`cat2-${index}`}
                link={`/${getDateString(card?.createdAt).replace(/\//g, "/")}/${
                  card?.newsCategory
                }/${card?.slug}`}
                text={
                  loading3 ? (
                    <TextLoader className="mx-auto text-center !bg-transparent" />
                  ) : (
                    card?.title
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstSection;
