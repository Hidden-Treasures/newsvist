import ColumnHead from "@/common/ColumnHead";
import MidCard from "@/components/cards/MidCard";
import TextOnly from "@/components/cards/TextOnly";
import getDateString from "@/hooks/useDateString";
import useNewsFetch from "@/hooks/useNewsFetch";
import React, { FC, useMemo } from "react";

const SeventhSection: FC = () => {
  const {
    data: midCard = [],
    loading: midLoading,
    error: midError,
  } = useNewsFetch({
    category: "Politics",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
  });
  const excludedFromMidCard = useMemo(
    () => midCard.map((article) => article._id),
    [midCard]
  );

  const {
    data: textOnly = [],
    loading: textLoading,
    error: textError,
  } = useNewsFetch({
    category: "Politics",
    subcategory: "2025 Election",
    type: undefined,
    tags: undefined,
    limit: 4,
    order: "desc",
    excludeIds: excludedFromMidCard,
  });
  const excludedFromTextOnly = useMemo(
    () => [
      ...excludedFromMidCard,
      ...(textOnly?.map((article) => article._id) || []),
    ],
    [excludedFromMidCard, textOnly]
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
    limit: 1,
    order: "desc",
    excludeIds: excludedFromTextOnly,
  });
  const excludedFromMidCard2 = useMemo(
    () => [...excludedFromTextOnly, ...midCard2.map((article) => article._id)],
    [excludedFromTextOnly, midCard2]
  );

  const {
    data: textOnly2 = [],
    loading: textLoading2,
    error: textError2,
  } = useNewsFetch({
    category: "Science",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 6,
    order: "desc",
    excludeIds: excludedFromMidCard2,
  });
  const excludedFromTextOnly2 = useMemo(
    () => [
      ...excludedFromMidCard2,
      ...(textOnly2?.map((article) => article._id) || []),
    ],
    [excludedFromMidCard2, textOnly2]
  );

  const {
    data: midCard3 = [],
    loading: midLoading3,
    error: MidError3,
  } = useNewsFetch({
    category: "Tech",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromTextOnly2,
  });
  const excludedFromMidCard3 = useMemo(
    () => [...excludedFromTextOnly2, ...midCard3.map((article) => article._id)],
    [excludedFromTextOnly2, midCard3]
  );

  const {
    data: textOnly3 = [],
    loading: textLoading3,
    error: textError3,
  } = useNewsFetch({
    category: "Business",
    subcategory: "Tech",
    type: undefined,
    tags: undefined,
    limit: 4,
    order: "desc",
    excludeIds: excludedFromMidCard3,
  });

  return (
    <div className="flex flex-wrap">
      {/* First Column (2 parts) */}
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
        <ColumnHead columnHeadTag="POLITICS" />
        {midCard &&
          midCard?.map((card, index) => (
            <MidCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?._id
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={midLoading}
              db={true}
            />
          ))}
        {textOnly &&
          textOnly?.map((card, index) => (
            <TextOnly
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?._id
              }`}
              loading={textLoading}
              text={card?.title}
            />
          ))}
      </div>

      {/* Second Column (1 part) */}
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
        {/* Content for the second column */}
        <ColumnHead columnHeadTag="SCIENCE AND HEALTH" />
        {midCard2 &&
          midCard2?.map((card, index) => (
            <MidCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?._id
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={midLoading2}
              db={true}
            />
          ))}
        {textOnly2 &&
          textOnly2?.map((card, index) => (
            <TextOnly
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?._id
              }`}
              loading={textLoading2}
              text={card?.title}
            />
          ))}
      </div>

      {/* Third Column (1 part) */}
      <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
        {/* Content for the third column */}
        <ColumnHead columnHeadTag="TECH" />
        {midCard3 &&
          midCard3?.map((card, index) => (
            <MidCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?._id
              }`}
              imageSrc={card?.file}
              loading={midLoading3}
              text={card?.title}
              db={true}
            />
          ))}
        {textOnly3 &&
          textOnly3?.map((card, index) => (
            <TextOnly
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.subCategory}/${
                card?._id
              }`}
              loading={textLoading3}
              text={card?.title}
            />
          ))}
      </div>
    </div>
  );
};

export default SeventhSection;
