import ColumnHead from "@/common/ColumnHead";
import MidCard from "@/components/cards/MidCard";
import TextOnly from "@/components/cards/TextOnly";
import getDateString from "@/hooks/useDateString";
import useNewsFetch from "@/hooks/useNewsFetch";
import Link from "next/link";
import React, { FC, useMemo } from "react";

const FifthSection: FC = () => {
  const {
    data: midCards = [],
    loading: midLoading,
    error: midError,
  } = useNewsFetch({
    category: "Business",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
  });
  const excludedFromMidCard = useMemo(
    () => midCards.map((article) => article._id),
    [midCards]
  );

  const {
    data: textOnly = [],
    loading: textLoading,
    error: textError,
  } = useNewsFetch({
    category: "Business",
    subcategory: "Market",
    type: undefined,
    tags: undefined,
    limit: 5,
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
    category: "Travel",
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
    category: "Travel",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 5,
    order: "desc",
    excludeIds: excludedFromMidCard2,
  });

  return (
    <div>
      <h2 className="pl-3.5 pt-6 pb-2 text-4xl font-bold">Featured Sections</h2>
      <div className="flex flex-wrap">
        {/* First Column (2 parts) */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
          {midCards?.length > 0 && <ColumnHead columnHeadTag="NV BUSINESS" />}
          {midCards &&
            midCards?.map((card, index) => (
              <MidCard
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                imageSrc={card?.file}
                text={card?.title}
                loading={midLoading}
                db={true}
              />
            ))}
          {textOnly &&
            textOnly?.length > 0 &&
            textOnly?.map((card, index) => (
              <TextOnly
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                text={card?.title}
                loading={textLoading}
              />
            ))}
        </div>

        {/* Second Column (1 part) */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
          {/* Content for the second column */}
          {midCard2?.length > 0 && <ColumnHead columnHeadTag="NV TRAVEL" />}
          {midCard2?.map((card, index) => (
            <MidCard
              key={index}
              link={`${getDateString(card?.createdAt)}/${card?.newsCategory}/${
                card?.slug
              }`}
              imageSrc={card?.file}
              text={card?.title}
              loading={midLoading2}
              db={true}
            />
          ))}
          {textOnly2 &&
            textOnly2?.length > 0 &&
            textOnly2?.map((card, index) => (
              <TextOnly
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                text={card?.title}
                loading={textLoading2}
              />
            ))}
        </div>

        {/* Third Column (1 part) */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
          {/* Content for the third column */}
          <Link href="/#">
            <div className="relative w-full h-full group">
              {/* Image */}
              {/* <VerticalAd /> */}
              {/* <img
                src="images/FifthSection/fifthadv.jpg"
                alt="analysis"
                className="w-full h-full object-cover transition-transform transform group-hover:scale-100"
              /> */}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gray-400 opacity-0"></div>
              <div className="text-xs">Advertisement</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FifthSection;
