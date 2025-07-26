import CategoryClient from "@/components/CategoryClient";

const CategoryPage = ({ params }: { params: { slug: string } }) => {
  return <CategoryClient slug={params.slug} />;
};

export default CategoryPage;
