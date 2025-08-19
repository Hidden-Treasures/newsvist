import Link from "next/link";
import NewsAndBuzz from "@/home/NewsAndBuzz";
import ColumnHead from "@/common/ColumnHead";
import TagSmallCard from "@/components/cards/TagSmallCard";
import getDateString from "@/hooks/useDateString";
import MetaTags from "@/common/MetaTags";

import { getArticleBySlug } from "@/services/news";
import ArticleContent from "@/components/ArticleContent";

interface PostPageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    category: string;
    slug: string;
  }>;
}

export default async function PostDetailsPage(props: PostPageProps) {
  const params = await props.params;
  const { slug } = params;

  const data = await getArticleBySlug(slug);
  const article = data?.article;
  const relatedNews = data?.relatedNews ?? [];

  if (!article) return <div>Article not found</div>;

  const stripHtmlTags = (html?: string): string => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  const articleDescription = `${stripHtmlTags(article?.editorText).substring(
    0,
    160
  )}... read more`;

  const articleUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <>
      {article && (
        <MetaTags
          title={article?.title}
          description={articleDescription}
          url={articleUrl}
          image={article?.file?.url}
        />
      )}
      <div className="flex flex-wrap">
        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4">
          <ArticleContent article={article} slug={slug} />
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-4 pr-2">
          {relatedNews.length > 0 && (
            <div className="mt-12 md:mt-[12.5rem]">
              <ColumnHead columnHeadTag="MORE FROM NEWSVIST" />
            </div>
          )}

          <div>
            {relatedNews.map((newsItem: any, index: number) => (
              <TagSmallCard
                key={index}
                link={`/${getDateString(newsItem.createdAt)}/${
                  newsItem.newsCategory
                }/${newsItem.slug}`}
                imageSrc={newsItem.file}
                text={newsItem.title}
                video={newsItem.video}
              />
            ))}
          </div>

          <div className="mt-12 md:mt-[12.5rem]">
            <ColumnHead columnHeadTag="NEWS & BUZZ" />
          </div>

          <NewsAndBuzz />

          <div className="mt-5">
            <Link href="/adv-link">
              <div className="w-full h-64 group mb-4">{/* <SquareAd /> */}</div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
