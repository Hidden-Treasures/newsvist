import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaLinkedin,
  FaSnapchat,
  FaThreads,
} from "react-icons/fa6";

import Link from "next/link";
import { JSX } from "react";
import { Globe } from "react-feather";
import { XIcon } from "react-share";

const platformIcons: Record<string, JSX.Element> = {
  Instagram: <FaInstagram size={28} />,
  "Twitter / X": <XIcon size={28} />,
  Facebook: <FaFacebook size={28} />,
  YouTube: <FaYoutube size={28} />,
  TikTok: <FaTiktok size={28} />,
  LinkedIn: <FaLinkedin size={28} />,
  Snapchat: <FaSnapchat size={28} />,
  Threads: <FaThreads size={28} />,
  Other: <Globe size={28} />,
};

export default function SocialLinks({
  socialMedia,
}: {
  socialMedia: Record<string, string>;
}) {
  if (!socialMedia) return null;

  return (
    <div className="flex space-x-4 mt-6">
      {Object.entries(socialMedia).map(([platform, url]) => {
        if (!url) return null;
        const icon = platformIcons[platform] || <Globe size={28} />;
        return (
          <Link
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition"
          >
            {icon}
          </Link>
        );
      })}
    </div>
  );
}
