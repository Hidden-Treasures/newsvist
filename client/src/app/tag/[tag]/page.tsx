import TagClient from "@/components/TagClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ tag: string }>;
};

const TagPage = async ({ params }: PageProps) => {
  const { tag } = await params;

  if (!tag) {
    notFound();
  }
  return <TagClient tag={tag} />;
};

export default TagPage;
