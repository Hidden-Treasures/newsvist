"use client";

import Link from "next/link";
import React from "react";

interface AuthorLinkProps {
  author?: string;
}

export default function AuthorLink({ author }: AuthorLinkProps) {
  if (!author) return null;

  return (
    <Link href={`/profiles/${author}`}>
      <span className="underline cursor-pointer">{author}</span>
    </Link>
  );
}
