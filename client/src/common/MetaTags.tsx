"use client";

import Head from "next/head";
import React, { FC } from "react";

interface MetaTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const MetaTags: FC<MetaTagsProps> = ({ title, description, url, image }) => {
  const defaultImage =
    "https://res.cloudinary.com/deazsxjtf/image/upload/v1753868573/newsvist_logo__pp8cit.png";
  const imageUrl = image && image.startsWith("http") ? image : defaultImage;

  return (
    <Head>
      <title>{title} | NewsVist</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="NewsVist" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:url" content={url} />
    </Head>
  );
};

export default MetaTags;
