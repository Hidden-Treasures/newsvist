import ColumnHead from "@/common/ColumnHead";
import MidCard from "@/components/cards/MidCard";
import TextOnly from "@/components/cards/TextOnly";
import getDateString from "@/hooks/useDateString";
import useNewsFetch from "@/hooks/useNewsFetch";
import React, { FC, useMemo } from "react";

const SixthSection: FC = () => {
  const {
    data: midCards = [],
    loading: midLoading,
    error: midError,
  } = useNewsFetch({
    category: "Sports",
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
    category: undefined,
    subcategory: "Football",
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
    category: "Style",
    subcategory: "Arts",
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
    category: "Style",
    subcategory: undefined,
    type: undefined,
    tags: undefined,
    limit: 5,
    order: "desc",
    excludeIds: excludedFromMidCard2,
  });
  const excludedFromTextOnly2 = useMemo(
    () => [...excludedFromMidCard2, ...textOnly2.map((article) => article._id)],
    [excludedFromMidCard2, textOnly2]
  );

  const {
    data: midCard3 = [],
    loading: midLoading3,
    error: MidError3,
  } = useNewsFetch({
    category: "Health",
    subcategory: "Sexual Health & Wellness",
    type: undefined,
    tags: undefined,
    limit: 1,
    order: "desc",
    excludeIds: excludedFromTextOnly2,
  });
  const excludedFromTextOnly3 = useMemo(
    () => [...excludedFromTextOnly2, ...midCard2.map((article) => article._id)],
    [excludedFromTextOnly2, midCard2]
  );

  const {
    data: textOnly3 = [],
    loading: textLoading3,
    error: textError3,
  } = useNewsFetch({
    category: "Health",
    subcategory: "Reproductive Health",
    type: undefined,
    tags: undefined,
    limit: 4,
    order: "desc",
    excludeIds: excludedFromTextOnly3,
  });

  return (
    <div>
      <div className="flex flex-wrap">
        {/* First Column (2 parts) */}
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 p-4">
          <ColumnHead columnHeadTag="SPORT" />
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
                video={card?.video}
              />
            ))}
          {textOnly &&
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
          <ColumnHead columnHeadTag="STYLE" />
          {midCard2 &&
            midCard2?.map((card, index) => (
              <MidCard
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?._id}`}
                imageSrc={card?.file}
                text={card?.title}
                loading={midLoading2}
                db={true}
                video={card?.video}
              />
            ))}
          {textOnly2 &&
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
          <ColumnHead columnHeadTag="SEXUAL HEALTH & WELLNESS" />
          {midCard3 &&
            midCard3?.map((card, index) => (
              <MidCard
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                imageSrc={card?.file}
                text={card?.title}
                loading={midLoading3}
                db={true}
                video={card?.video}
              />
            ))}
          {textOnly3 &&
            textOnly3?.map((card, index) => (
              <TextOnly
                key={index}
                link={`${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?.slug}`}
                text={card?.title}
                loading={textLoading3}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SixthSection;
