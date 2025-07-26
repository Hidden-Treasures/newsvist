"use client";

import React, { FC } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  ThreadsShareButton,
  WhatsappIcon,
  LinkedinIcon,
  XIcon,
  ThreadsIcon,
  TelegramIcon,
  TelegramShareButton,
} from "react-share";

interface ShareProps {
  url: string;
  title: string;
  hashtag?: string;
  description?: string;
  image?: string;
}

const Share: FC<ShareProps> = ({ url, title, hashtag, description }) => {
  const cleanHashtag = hashtag?.replace("#", "") || "newsvistupdates";

  return (
    <div className="flex items-center gap-4 my-4">
      <FacebookShareButton url={url} hashtag={`#${cleanHashtag}`}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <TwitterShareButton url={url} title={title} hashtags={[cleanHashtag]}>
        <XIcon size={32} round />
      </TwitterShareButton>
      <ThreadsShareButton url={url} title={title} hashtags={[cleanHashtag]}>
        <ThreadsIcon size={32} round />
      </ThreadsShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <LinkedinShareButton url={url} summary={description} source="NewsVist">
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
      <TelegramShareButton url={url} title={title}>
        <TelegramIcon size={32} round />
      </TelegramShareButton>
    </div>
  );
};

export default Share;
