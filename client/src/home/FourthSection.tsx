import BigCard from "@/components/cards/BigCard";
import MidCard from "@/components/cards/MidCard";
import SmallHorizontalCard from "@/components/cards/SmallHorizontalCard";
import getDateString from "@/hooks/useDateString";
import useNewsFetch from "@/hooks/useNewsFetch";
import React, { FC, useMemo } from "react";

const FourthSection: FC = () => {
  const {
    data: midCards = [],
    loading: loading1,
    error: error1,
  } = useNewsFetch({
    category: "News",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
  });

  const excludedFromMidCards = useMemo(
    () => midCards.map((article) => article._id),
    [midCards]
  );

  const {
    data: smallHorizontalCard = [],
    loading: smallCardLoading,
    error: smallCardError,
  } = useNewsFetch({
    category: "Nigeria",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 4,
    order: "desc",
    excludeIds: excludedFromMidCards,
  });

  const excludedFromSmallHorizontalCard = useMemo(
    () => [
      ...excludedFromMidCards,
      ...(smallHorizontalCard?.map((article) => article._id) || []),
    ],
    [excludedFromMidCards, smallHorizontalCard]
  );

  const {
    data: bigCard = [],
    loading: bigCardLoading,
    error: bigCardError,
  } = useNewsFetch({
    category: "Style",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromSmallHorizontalCard,
  });

  const excludedFromBigCard = useMemo(
    () => [
      ...excludedFromSmallHorizontalCard,
      ...(bigCard?.map((article) => article._id) || []),
    ],
    [excludedFromSmallHorizontalCard, bigCard]
  );

  const {
    data: smallHorizontalCard2 = [],
    loading: smallCardLoading2,
    error: smallCardError2,
  } = useNewsFetch({
    category: "World",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 2,
    order: "desc",
    excludeIds: excludedFromBigCard,
  });

  const excludedFromSmallHorizontalCard2 = useMemo(
    () => [
      ...excludedFromBigCard,
      ...(smallHorizontalCard2?.map((article) => article._id) || []),
    ],
    [excludedFromBigCard, smallHorizontalCard2]
  );

  const {
    data: midCard2 = [],
    loading: midLoading2,
    error: MidError2,
  } = useNewsFetch({
    category: "Health",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 3,
    order: "desc",
    excludeIds: excludedFromSmallHorizontalCard2,
  });
  const excludedFromMidCard2 = useMemo(
    () => [
      ...excludedFromSmallHorizontalCard2,
      ...midCard2.map((article) => article._id),
    ],
    [excludedFromSmallHorizontalCard2, midCard2]
  );

  const {
    data: smallHorizontalCard3 = [],
    loading: smallCardLoading3,
    error: smallCardError3,
  } = useNewsFetch({
    category: "World",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromMidCard2,
  });

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 p-4">
        {midCards?.map((card, index) => (
          <MidCard
            key={index}
            link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
              card?.slug
            }`}
            imageSrc={card?.file}
            text={card?.title}
            tags={card?.tags}
            loading={loading1}
            db={true}
            video={card?.video}
          />
        ))}
        {smallHorizontalCard &&
          smallHorizontalCard?.map((card, index) => (
            <SmallHorizontalCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={bigCardLoading}
            />
          ))}
      </div>
      <div className="w-full md:w-2/3 p-4">
        {bigCard &&
          bigCard?.map((card, index) => (
            <BigCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={bigCardLoading}
            />
          ))}
        {smallHorizontalCard2 &&
          smallHorizontalCard2?.map((card, index) => (
            <SmallHorizontalCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={smallCardLoading2}
            />
          ))}
      </div>
      <div className="w-full md:w-1/3 p-4">
        {midCard2?.map((card, index) => (
          <MidCard
            key={index}
            link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
              card?.slug
            }`}
            imageSrc={card?.file}
            text={card?.title}
            tags={card?.tags}
            loading={midLoading2}
            db={true}
          />
        ))}
        {smallHorizontalCard3 &&
          smallHorizontalCard3?.map((card, index) => (
            <SmallHorizontalCard
              key={`cat1-${index}`}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={smallCardLoading3}
            />
          ))}
      </div>
    </div>
  );
};

export default FourthSection;
