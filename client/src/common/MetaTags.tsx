"use client";

import Head from "next/head";
import React from "react";

interface MetaTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  url,
  image,
}) => {
  const defaultImage = "/default-og-image.jpg";

  return (
    <Head>
      <title>{title} | NewsVist</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="NewsVist" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      <meta name="twitter:url" content={url} />
    </Head>
  );
};

export default MetaTags;
