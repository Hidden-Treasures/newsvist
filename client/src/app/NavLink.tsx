"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { MouseEvent, ReactNode } from "react";

interface NavLinkProps {
  href?: string;
  children: ReactNode;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export default function NavLink({
  href,
  children,
  className,
  end = false,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();

  const isActive =
    href &&
    (end
      ? pathname === href
      : pathname.startsWith(href) ||
        (href !== "/" && pathname.startsWith(`${href}/`)));

  const resolvedClassName =
    typeof className === "function"
      ? className({ isActive: !!isActive })
      : clsx(
          className,
          isActive && "text-indigo-500",
          !isActive && "text-slate-400 hover:text-slate-200"
        );

  return href ? (
    <Link href={href} className={resolvedClassName} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <span className={resolvedClassName} onClick={onClick}>
      {children}
    </span>
  );
}
