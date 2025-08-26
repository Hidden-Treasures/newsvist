"use client";

import NavLink from "@/app/NavLink";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useAuth";
import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useState } from "react";
import Select from "react-select";

interface NavbarProps {
  onSearchButtonClick?: () => void;
}

const Navbar: FC<NavbarProps> = ({ onSearchButtonClick }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any[]>([]);

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { refetch: refetchProfile } = useProfile();
  const { data, isLoading } = useCategories();

  const categories = data || [];
  const mainCategories = categories.slice(0, 8);
  const extraCategories = categories.slice(8);

  const toggleMenu = () => setMenuOpen(!isMenuOpen);

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

  const handleCategoryChange = (selected: any) => {
    setSelectedCategories(selected || []);
    console.log(
      "Selected categories:",
      selected.map((c: any) => c.value)
    );
  };

  return (
    <>
      <div className="hidden md:block">
        <nav className="flex bg-black p-4">
          <div className="flex basis-3/4 justify-evenly items-center mr-4 relative">
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
                {[
                  "US",
                  "World",
                  "Politics",
                  "Business",
                  "Opinion",
                  "Health",
                  "Entertainment",
                  "Sports",
                ].map((cat) => (
                  <NavLink
                    key={cat}
                    href={`/category/${cat}`}
                    className="text-white text-[0.937rem] font-bold"
                  >
                    {cat}
                  </NavLink>
                ))}
              </>
            ) : (
              <>
                {mainCategories.map((cat: any) => (
                  <NavLink
                    key={cat._id}
                    href={`/category/${cat.title}`}
                    className="text-white text-[0.937rem] capitalize font-bold"
                  >
                    {cat.title}
                  </NavLink>
                ))}

                {extraCategories.length > 0 && (
                  <div className="relative group">
                    <button className="text-white text-[0.937rem] font-bold flex items-center">
                      More
                      <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Dropdown - opens on hover via group-hover */}
                    <div className="absolute left-0 mt-2 w-40 bg-white rounded shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {extraCategories.map((cat: any) => (
                        <NavLink
                          key={cat._id}
                          href={`/category/${cat.title}`}
                          className="block px-4 py-2 text-black text-[0.875rem] capitalize hover:bg-gray-100 hover:rounded-t-sm"
                        >
                          {cat.title}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex basis-1/4 justify-evenly items-center ">
            {/* {staticLinks.map((item) => (
              <NavLink
                key={item.slug}
                href={`/category/${item.slug}`}
                className="text-white text-[0.937rem] font-bold"
              >
                {item.title}
              </NavLink>
            ))} */}
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
          className={`overflow-hidden transition-max-height duration-300 bg-black px-4 ${
            isMenuOpen ? "max-h-screen py-4" : "max-h-0"
          }`}
        >
          {/* Categories + Home */}
          <nav className="flex flex-wrap gap-3 justify-center">
            {/* Home link */}
            <NavLink
              href="/"
              className="bg-gray-800 hover:bg-gray-700 transition text-white px-2 py-2 rounded-md font-semibold shadow-md text-sm"
            >
              Home
            </NavLink>

            {/* Categories */}
            {(isLoading
              ? [
                  "Business",
                  "Entertainment",
                  "Health",
                  "Opinion",
                  "Politics",
                  "Sports",
                  "US",
                  "World",
                ]
              : categories.map((cat: any) => cat.title)
            )
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((cat: string) => (
                <NavLink
                  key={cat}
                  href={`/category/${cat}`}
                  className="bg-gray-800 hover:bg-gray-700 transition text-white px-2 py-2 rounded-md font-semibold shadow-md text-sm"
                >
                  {cat}
                </NavLink>
              ))}

            {/* Static Links */}
            {["Watch", "Listen", "Live TV"].map((link) => (
              <NavLink
                key={link}
                href={`/category/${link.toLowerCase().replace(" ", "-")}`}
                className="bg-gray-800 hover:bg-gray-700 transition text-white px-2 py-2 rounded-md font-semibold shadow-md text-sm"
              >
                {link}
              </NavLink>
            ))}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <button
                onClick={handleProfileClick}
                className="bg-transparent hover:bg-white text-white hover:text-black border border-white px-4 py-2 rounded-md font-bold shadow-md text-sm transition"
              >
                Profile
              </button>
            ) : (
              <NavLink
                href="/login"
                className="bg-transparent hover:bg-white text-white hover:text-black border border-white px-4 py-2 rounded-md font-bold shadow-md text-sm transition"
              >
                Log In
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
