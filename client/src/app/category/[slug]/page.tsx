"use client";

import Footer from "@/common/Footer";
import Header from "@/common/header";
import MidCard from "@/components/cards/MidCard";
import TextOnly from "@/components/cards/TextOnly";
import VideoDisplay from "@/helper/VideoDisplay";
import getDateString from "@/hooks/useDateString";
import { useArticlesByCategory } from "@/hooks/useNews";
import useNewsFetch from "@/hooks/useNewsFetch";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const sectionTypes = [
  "TopStories",
  "LiveUpdate",
  "Analysis",
  "Business & Tech",
  "Sports",
  "Art & Style",
  "Space & Science",
  "Health & Wellness",
  "Global Travel",
  "Celebrities & Entertainment",
  "Education",
];

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  const searchParams = useSearchParams();
  const subcategory = searchParams.get("sub");

  const [showFooterSearch, setShowFooterSearch] = useState(false);
  const onSearchButtonClick = () => {
    setShowFooterSearch(!showFooterSearch);
  };

  const {
    data: articles = [],
    isLoading,
    isError,
  } = useArticlesByCategory({
    category: subcategory ? undefined : params.slug,
    subcategory: subcategory || undefined,
    limit: 8,
    order: "createdAt",
  });

  const excludedFromArticles = useMemo(() => {
    return articles?.map((article) => article._id).join(",") || "";
  }, [articles]);

  const {
    data: breaking = [],
    isLoading: loading2,
    isError: error2,
  } = useArticlesByCategory({
    category: subcategory ? undefined : params.slug,
    subcategory: subcategory || undefined,
    type: "Breaking",
    limit: 5,
    order: "createdAt",
    excludeIds: excludedFromArticles,
  });

  const excludedFromBreaking = useMemo(() => {
    return breaking?.map((b) => b?._id).join(",") || "";
  }, [breaking]);

  const {
    data: analysis = [],
    isLoading: loading4,
    isError: error4,
  } = useArticlesByCategory({
    category: subcategory ? undefined : params.slug,
    subcategory: subcategory || undefined,
    type: "Analysis",
    limit: 10,
    order: "createdAt",
    excludeIds: excludedFromBreaking,
  });

  const excludedFromAnalysis = useMemo(() => {
    return analysis?.map((a) => a?._id).join(",") || "";
  }, [analysis]);

  const {
    data: textOnly = [],
    isLoading: loading3,
    isError: error3,
  } = useArticlesByCategory({
    category: subcategory ? undefined : params.slug,
    subcategory: subcategory || undefined,
    type: "General",
    limit: 12,
    order: "createdAt",
    excludeIds: excludedFromAnalysis,
  });

  const excludedFromTextOnly = useMemo(() => {
    return textOnly?.map((text) => text?._id).join(",") || "";
  }, [textOnly]);

  const {
    data: sports = [],
    isLoading: loading5,
    isError: error5,
  } = useArticlesByCategory({
    category: subcategory ? undefined : params.slug,
    subcategory: subcategory || undefined,
    type: "Sports",
    limit: 20,
    order: "createdAt",
    excludeIds: excludedFromTextOnly,
  });

  const excludedFromSports = useMemo(() => {
    return sports?.map((s) => s?._id).join(",") || "";
  }, [sports]);

  const {
    data: topStories = [],
    isLoading: loading6,
    isError: error6,
  } = useArticlesByCategory({
    category: subcategory ? undefined : params.slug,
    subcategory: subcategory || undefined,
    type: "TopStories",
    limit: 20,
    order: "createdAt",
    excludeIds: excludedFromSports,
  });

  const heroStory = articles?.[0];
  const secondaryStories = articles?.slice(1, 3);
  const gridStories = articles?.slice(3, 7);

  if (isLoading || loading2 || loading3 || loading4 || loading5) {
    return (
      <div className="h-screen flex justify-center items-center bg-white">
        <p className="text-light-subtle animate-pulse !bg-transparent">
          Please wait
        </p>
      </div>
    );
  }

  //   if (isError || error2 || error3 || error4 || error5) {
  //     return (
  //       <div className="p-4 text-red-500">
  //         Something went wrong: {isError || error2 || error3 || error4 || error5}
  //       </div>
  //     );
  //   }

  return (
    <>
      <Header onSearchButtonClick={onSearchButtonClick} />
      <main className="p-4 space-y-8 max-w-screen-xl mx-auto">
        {/* Hero Story */}
        {heroStory && (
          <MidCard
            key={`hero`}
            link={`/${getDateString(heroStory.createdAt)}/${
              heroStory.newsCategory
            }/${heroStory.slug}`}
            imageSrc={heroStory.file}
            text={heroStory.title}
            tags={heroStory.tags}
            db={true}
            className="w-full h-auto"
          />
        )}

        {/* Secondary Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secondaryStories?.map((card, index) => (
            <MidCard
              key={`secondary-${index}`}
              link={`/${getDateString(card.createdAt)}/${card.newsCategory}/${
                card.slug
              }`}
              imageSrc={card.file}
              text={card.title}
              tags={card.tags}
              db={true}
            />
          ))}
        </div>

        {/* Grid of More Stories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gridStories?.map((card, index) => (
            <MidCard
              key={`grid-${index}`}
              link={`/${getDateString(card.createdAt)}/${card.newsCategory}/${
                card.slug
              }`}
              imageSrc={card.file}
              text={card.title}
              tags={card.tags}
              db={true}
            />
          ))}
        </div>

        {/* Video/Breaking Section */}
        {breaking?.[0]?.video && (
          <div className="my-8">
            <div className="font-bold text-xl mb-2">In Case You Missed It</div>
            <Link
              href={`/${getDateString(breaking[0]?.createdAt)}/${
                breaking[0]?.newsCategory
              }/${breaking[0]?._id}`}
            >
              <VideoDisplay
                image={breaking[0]?.file}
                video={breaking[0]?.video}
                playVideo={true}
              />
            </Link>
          </div>
        )}

        {/* Analysis Section */}
        {analysis?.length > 0 && (
          <div className="my-8">
            <div className="font-bold text-xl mb-2">In-Depth Analysis</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analysis?.map((card, index) => (
                <MidCard
                  key={`analysis-${index}`}
                  link={`/${getDateString(card.createdAt)}/${
                    card.newsCategory
                  }/${card.slug}`}
                  imageSrc={card.file}
                  text={card.title}
                  tags={card.tags}
                  db={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Sports Section */}
        {sports?.length > 0 && (
          <div className="my-8">
            <div className="font-bold text-xl mb-2">Sports Highlights</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sports?.map((card, index) => (
                <MidCard
                  key={`sports-${index}`}
                  link={`/${getDateString(card.createdAt)}/${
                    card.newsCategory
                  }/${card.slug}`}
                  imageSrc={card.file}
                  text={card.title}
                  tags={card.tags}
                  db={true}
                />
              ))}
            </div>
          </div>
        )}

        {topStories?.length > 0 && (
          <div className="my-8">
            <div className="font-bold text-xl mb-2">Top Stories</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {topStories?.map((card, index) => (
                <MidCard
                  key={`topStories-${index}`}
                  link={`/${getDateString(card.createdAt)}/${
                    card.newsCategory
                  }/${card.slug}`}
                  imageSrc={card.file}
                  text={card.title}
                  tags={card.tags}
                  db={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Headline List */}
        <div>
          <div className="text-lg font-semibold mb-2 border-b pb-2">
            More Headlines
          </div>
          <div className="grid gap-2">
            {textOnly?.map((card, index) => (
              <TextOnly
                key={`headline-${index}`}
                link={`/${getDateString(card?.createdAt)}/${
                  card?.newsCategory
                }/${card?._id}`}
                text={card?.title}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
      {/* <div className="flex flex-col md:flex-row">

              <div className="w-full md:w-1/3 p-4 ">
                {midCards?.map((card, index) => (
                  <MidCard
                    key={`cat1-${index}`}
                    link={`/${getDateString(card?.createdAt)}/${
                      card?.newsCategory
                    }/${card?.slug}`}
                    imageSrc={card?.file}
                    text={card?.title}
                    tags={card?.tag}
                    db={true}
                  />
                ))}
              </div>
              <div className="w-full md:w-1/3 p-4 ">
                {midCards2?.map((card, index) => (
                  <MidCard
                    key={`cat1-${index}`}
                    link={`/${getDateString(card?.createdAt)}/${
                      card?.newsCategory
                    }/${card?.slug}`}
                    imageSrc={card?.file}
                    text={card?.title}
                    tags={card?.tag}
                    db={true}
                  />
                ))}
              </div>
              <div className="w-full md:w-1/3 p-4 ">
                <Link
                  href={`/${
                    breaking && breaking.length > 0
                      ? `${getDateString(breaking[0]?.createdAt)}/${
                          breaking[0]?.newsCategory
                        }/${breaking[0]?._id}`
                      : ""
                  }`}
                  className="relative w-305 h-171 group mb-4"
                >
                  <>
                    {breaking?.length >= 0 && breaking[0]?.video && (
                      <VideoDisplay
                        image={breaking[0]?.file}
                        video={breaking[0]?.video}
                        playVideo={true}
                      />
                    )}
                  </>
                </Link>
                <div>
                  <div className="mb-2 mt-4 font-bold text-xl hover:underline">
                    Catch up on todays global news
                  </div>
                  <div>
                    {textOnly?.map((card, index) => (
                      <TextOnly
                        key={`cat2-${index}`}
                        link={`/${getDateString(card?.createdAt)}/${
                          card?.newsCategory
                        }/${card?._id}`}
                        text={card?.title}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div> */}
    </>
  );
};

export default CategoryPage;
