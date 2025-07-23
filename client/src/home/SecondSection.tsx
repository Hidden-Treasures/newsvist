import ColumnHead from "@/common/ColumnHead";
import BigCard from "@/components/cards/BigCard";
import MidCard from "@/components/cards/MidCard";
import SmallHorizontalCard from "@/components/cards/SmallHorizontalCard";
import TagSmallCard from "@/components/cards/TagSmallCard";
import TextOnly from "@/components/cards/TextOnly";
import FileDisplay from "@/helper/FileDisplay";
import TextError from "@/helper/TextError";
import TextLoader from "@/helper/TextLoader";
import VideoDisplay from "@/helper/VideoDisplay";
import getDateString from "@/hooks/useDateString";
import useNewsFetch from "@/hooks/useNewsFetch";
import Link from "next/link";
import React, { FC, useMemo } from "react";

const SecondSection: FC = () => {
  const {
    data: midCard = [],
    loading: midLoading,
    error: midError,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "TopStories",
    tags: undefined,
    limit: 3,
    order: "desc",
  });
  const excludedFromMidCard = useMemo(
    () => midCard.map((article) => article._id),
    [midCard]
  );

  const {
    data: midCard2 = [],
    loading: midLoading2,
    error: MidError2,
  } = useNewsFetch({
    category: "News",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 3,
    order: "desc",
    excludeIds: excludedFromMidCard,
  });
  const excludedFromMidCard2 = useMemo(
    () => [...excludedFromMidCard, ...midCard2.map((article) => article._id)],
    [excludedFromMidCard, midCard2]
  );

  const {
    data: bigCard = [],
    loading: bigCardLoading,
    error: bigCardError,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "Analysis",
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromMidCard2,
  });
  const excludedFromBigCard = useMemo(
    () => [
      ...excludedFromMidCard2,
      ...(bigCard?.map((article) => article._id) || []),
    ],
    [excludedFromMidCard2, bigCard]
  );
  const {
    data: textOnly = [],
    loading: textLoading,
    error: textError,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "TopStory",
    tags: undefined,
    limit: 6,
    order: "desc",
    excludeIds: excludedFromBigCard,
  });
  const excludedFromTextOnly = useMemo(
    () => [
      ...excludedFromBigCard,
      ...(textOnly?.map((article) => article._id) || []),
    ],
    [excludedFromBigCard, textOnly]
  );
  const {
    data: smallHorizontalCard = [],
    loading: smallCardLoading,
    error: smallCardError,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "Global Travel",
    tags: undefined,
    limit: 2,
    order: "desc",
    excludeIds: excludedFromTextOnly,
  });
  const excludedFromSmallHorizontalCard = useMemo(
    () => [
      ...excludedFromTextOnly,
      ...(smallHorizontalCard?.map((article) => article._id) || []),
    ],
    [excludedFromTextOnly, smallHorizontalCard]
  );
  const {
    data: smallHorizontalCard3 = [],
    loading: smallCardLoading3,
    error: smallCardError3,
  } = useNewsFetch({
    category: undefined,
    subcategory: "Food & Drink",
    type: "Global Travel",
    tags: undefined,
    limit: 4,
    order: "desc",
    excludeIds: excludedFromSmallHorizontalCard,
  });
  const excludedFromSmallHorizontalCard3 = useMemo(
    () => [
      ...excludedFromSmallHorizontalCard,
      ...(smallHorizontalCard3?.map((article) => article._id) || []),
    ],
    [excludedFromSmallHorizontalCard, smallHorizontalCard3]
  );
  const {
    data: smallHorizontalCard4 = [],
    loading: smallCardLoading4,
    error: smallCardError4,
  } = useNewsFetch({
    category: undefined,
    subcategory: undefined,
    type: "Education",
    tags: undefined,
    limit: 4,
    order: "desc",
    excludeIds: excludedFromSmallHorizontalCard3,
  });

  return (
    <div className="flex flex-col md:flex-row">
      {midCard?.length > 0 && (
        <div className="w-full md:w-1/4 p-4">
          <ColumnHead columnHeadTag="MORE TOP STORIES" />
          {midCard?.map((card, index) => (
            <MidCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              tags={card?.tags}
              loading={midLoading}
              db={true}
            />
          ))}
          {textOnly && textOnly?.length > 0 && (
            <>
              {textOnly?.map((card, index) => (
                <TextOnly
                  key={index}
                  link={`${getDateString(card?.createdAt)}/${
                    card?.newsCategory
                  }/${card?.slug}`}
                  text={card?.title}
                  loading={textLoading}
                />
              ))}
            </>
          )}
        </div>
      )}
      <div className="w-full md:w-1/2 p-4">
        {bigCard?.length > 0 && (
          <div>
            <ColumnHead columnHeadTag="ANALYSIS" />
            {bigCard &&
              bigCard?.map((card, index) => (
                <BigCard
                  key={index}
                  link={`${getDateString(card?.createdAt)}/${
                    card?.newsCategory
                  }/${card?.slug}`}
                  imageSrc={card?.file}
                  text={card?.title}
                  loading={bigCardLoading}
                  video={card?.video}
                />
              ))}
            {smallHorizontalCard &&
              smallHorizontalCard?.map((card, index) => (
                <SmallHorizontalCard
                  key={index}
                  link={`${getDateString(card?.createdAt)}/${
                    card?.newsCategory
                  }/${card?.slug}`}
                  imageSrc={card?.file}
                  text={card?.title}
                  loading={smallCardLoading}
                  video={card?.video}
                />
              ))}
          </div>
        )}
        {midCard2?.length > 0 && (
          <div className="mt-8">
            <ColumnHead columnHeadTag="NEWS" />
            {midCard2?.map((card, index) => (
              <MidCard
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                imageSrc={card?.file}
                text={card?.title}
                tags={card?.tags}
                loading={midLoading2}
                db={true}
              />
            ))}
          </div>
        )}
      </div>

      <div className="w-full md:w-1/4 p-4">
        <Link href="/adv-link">
          <div className="w-full h-64 group mb-4 ">
            <div className="w-full h-full group">
              {/* <SquareAd /> */}
              {/* <img
                src="images/SecondSection/adv.jpg"
                alt=""
                className="w-full h-full object-cover"
              /> */}
            </div>
            {/* <div className="text-sm">Advertisement</div> */}
          </div>
        </Link>
        {smallHorizontalCard3?.length > 0 &&
          smallHorizontalCard3?.map((card, index) => (
            <TagSmallCard
              key={`cat1-${index}`}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={smallCardLoading3}
            />
          ))}
        {smallHorizontalCard4.length > 0 && (
          <div>
            <ColumnHead columnHeadTag="EDUCATION" />
            {smallHorizontalCard4?.map((card, index) => (
              <TagSmallCard
                key={`cat2-${index}`}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                imageSrc={card?.file}
                text={card?.title}
                loading={smallCardLoading4}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondSection;
