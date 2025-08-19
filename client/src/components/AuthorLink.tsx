"use client";

import Link from "next/link";
import React from "react";

interface AuthorLinkProps {
  authorName?: string;
}

export default function AuthorLink({ authorName }: AuthorLinkProps) {
  if (!authorName) return null;

  return (
    <Link href={`/profiles/${authorName}`}>
      <span className="underline cursor-pointer">{authorName}</span>
    </Link>
  );
}
