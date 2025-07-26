import CategoryClient from "@/components/CategoryClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const CategoryPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }
  return <CategoryClient slug={slug} />;
};

export default CategoryPage;
