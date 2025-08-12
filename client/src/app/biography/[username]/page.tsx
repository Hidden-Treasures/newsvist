import BiographyClient from "@/components/BiographyClient";
import { getBioByNameService } from "@/services/biography";
import { notFound } from "next/navigation";
import React from "react";

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  const data = await getBioByNameService(username);

  if (!data) {
    notFound();
  }

  return <BiographyClient data={data} />;
}
