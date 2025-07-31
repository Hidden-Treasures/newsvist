"use client";

import NavLink from "@/app/NavLink";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";

interface NavbarProps {
  onSearchButtonClick?: () => void;
}

const Navbar: FC<NavbarProps> = ({ onSearchButtonClick }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { refetch: refetchProfile } = useProfile();
  const { data, isLoading } = useCategories();
  const categories = data?.slice(0, 13) || [];

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const staticLinks = [
    { title: "Watch", slug: "Watch" },
    { title: "Listen", slug: "Listen" },
    { title: "Live TV", slug: "live-tv" },
  ];

  const handleProfileClick = async (): Promise<void> => {
    const profile = await refetchProfile();
    const role = profile.data?.user?.role ?? profile.data?.role;
    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "editor") {
      router.push("/editor/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <nav className="flex bg-black p-4">
          <div className="flex basis-3/4 justify-evenly items-center mr-4">
            <div
              onClick={() => {
                toggleMenu();
                if (onSearchButtonClick) {
                  onSearchButtonClick();
                }
              }}
              className="text-white focus:outline-none cursor-pointer "
            >
              {isMenuOpen ? (
                // Close icon (X)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white text-[0.937rem] font-bold"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </div>
            <Link href="/">
              <div className="flex justify-center">
                <Image
                  src={
                    "https://res.cloudinary.com/deazsxjtf/image/upload/v1753868566/full_logo_u40lkd.png"
                  }
                  alt="Newsvist Logo"
                  width={120}
                  height={32}
                  className="w-auto h-10"
                />
              </div>
            </Link>
            {isLoading ? (
              <>
                <NavLink
                  href="/category/US"
                  className="text-white text-[0.937rem] font-bold"
                >
                  US
                </NavLink>
                <NavLink
                  href="/category/World"
                  className="text-white text-[0.937rem] font-bold"
                >
                  World
                </NavLink>
                <NavLink
                  href="/category/Politics"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Politics
                </NavLink>
                <NavLink
                  href="/category/Business"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Business
                </NavLink>
                <NavLink
                  href="/category/Opinion"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Opinion
                </NavLink>
                <NavLink
                  href="/category/Health"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Health
                </NavLink>
                <NavLink
                  href="/category/Entertainment"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Entertainment
                </NavLink>
                <NavLink
                  href="/category/Style"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Style
                </NavLink>
                <NavLink
                  href="/category/Travel"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Travel
                </NavLink>
                <NavLink
                  href="/category/Sports"
                  className="text-white text-[0.937rem] font-bold"
                >
                  Sports
                </NavLink>
              </>
            ) : (
              categories?.map((cat: any) => (
                <NavLink
                  key={cat._id}
                  href={`/category/${cat.title}`}
                  className="text-white text-[0.937rem] capitalize font-bold"
                >
                  {cat.title}
                </NavLink>
              ))
            )}
          </div>
          <div className="flex basis-1/4 justify-evenly items-center ">
            {staticLinks.map((item) => (
              <NavLink
                key={item.slug}
                href={`/category/${item.slug}`}
                className="text-white text-[0.937rem] font-bold"
              >
                {item.title}
              </NavLink>
            ))}
            <div className=" cursor-pointer" onClick={onSearchButtonClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>

            {isAuthenticated ? (
              <button
                onClick={handleProfileClick}
                className="text-white p-1 rounded text-[0.937rem] border border-white font-bold cursor-pointer"
              >
                Profile
              </button>
            ) : (
              <NavLink
                href="/login"
                className="text-white p-1 rounded text-[0.937rem] border border-white font-bold cursor-pointer"
              >
                Log In
              </NavLink>
            )}
          </div>
        </nav>
      </div>
      <div className="block md:hidden bg-black text-white pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none lg:hidden "
            >
              {isMenuOpen ? (
                // Close icon (X)
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-white text-[0.937rem] font-bold"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
            <div className="logo flex justify-center">
              <Link href="/">
                <Image
                  src={
                    "https://res.cloudinary.com/deazsxjtf/image/upload/v1753868601/newsvist-text_auxefn.png"
                  }
                  alt="Newsvist Logo"
                  width={50}
                  height={32}
                  className="w-auto h-3"
                />
              </Link>
            </div>
          </div>

          <div className="flex pl-3 pr-3">
            <div className="cursor-pointer mr-43" onClick={onSearchButtonClick}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </div>
            <div> Live Tv</div>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className="md:hidden block">
        <div
          className={`flex flex-col lg:flex flex-grow items-center  bg-black pb-4 ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          <NavLink
            href="/"
            // exact
            className="text-white text-[0.937rem] font-bold"
          >
            Home
          </NavLink>
          {isLoading ? (
            <>
              <NavLink
                href="/category/Nigeria"
                className="text-white text-[0.937rem] font-bold"
              >
                NG
              </NavLink>
              <NavLink
                href="/category/World"
                className="text-white text-[0.937rem] font-bold"
              >
                World
              </NavLink>
              <NavLink
                href="/category/Politics"
                className="text-white text-[0.937rem] font-bold"
              >
                Politics
              </NavLink>
              <NavLink
                href="/category/Business"
                className="text-white text-[0.937rem] font-bold"
              >
                Business
              </NavLink>
              <NavLink
                href="/category/Opinion"
                className="text-white text-[0.937rem] font-bold"
              >
                Opinion
              </NavLink>
              <NavLink
                href="/category/Health"
                className="text-white text-[0.937rem] font-bold"
              >
                Health
              </NavLink>
              <NavLink
                href="/category/Entertainment"
                className="text-white text-[0.937rem] font-bold"
              >
                Entertainment
              </NavLink>
              <NavLink
                href="/category/Style"
                className="text-white text-[0.937rem] font-bold"
              >
                Style
              </NavLink>
              <NavLink
                href="/category/Travel"
                className="text-white text-[0.937rem] font-bold"
              >
                Travel
              </NavLink>
              <NavLink
                href="/category/Sports"
                className="text-white text-[0.937rem] font-bold"
              >
                Sports
              </NavLink>
            </>
          ) : (
            categories.map((cat: any) => (
              <NavLink
                key={cat._id}
                href={`/category/${cat.title}`}
                className="text-white text-[0.937rem] font-bold"
              >
                {cat.title}
              </NavLink>
            ))
          )}

          {isAuthenticated ? (
            <button
              onClick={handleProfileClick}
              className="text-white p-1 rounded text-[0.937rem] border border-white font-bold cursor-pointer"
            >
              Profile
            </button>
          ) : (
            <NavLink
              href="/login"
              className="text-white p-1 rounded text-[0.937rem] border border-white font-bold mt-2 cursor-pointer"
            >
              Log In
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
