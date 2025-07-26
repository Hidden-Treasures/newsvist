"use client";

import NavLink from "@/app/NavLink";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useAuth";
import { useAllCategories, useFooter } from "@/hooks/useCategories";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, ChangeEvent, FC } from "react";
import { Facebook, Instagram } from "react-feather";
import { XIcon } from "react-share";

interface FooterProps {
  SearchText?: string;
}

const Footer: FC<FooterProps> = ({ SearchText = "" }) => {
  const [searchText, setSearchText] = useState<string>(SearchText);
  const { isAuthenticated } = useAuth();
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const { refetch: refetchProfile } = useProfile();
  const isLoggedIn = isAuthenticated;
  const { data: categories = [], isLoading, refetch } = useFooter();

  const handleProfileClick = async (): Promise<void> => {
    const profile = await refetchProfile();
    const role = profile.data ? profile.data?.user?.role : profile.data?.role;
    switch (role) {
      case "admin":
        router.push("/admin/dashboard");
        break;
      case "editor":
        router.push("/editor/dashboard");
        break;
      default:
        router.push("/");
        break;
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  const handleSearch = (): void => {
    router.push(`/search?q=${encodeURIComponent(searchText)}`);
  };

  if (!categories) {
    return <div className="text-white">Failed to load categories</div>;
  }

  const mid = Math.ceil(categories.length / 2);
  const categoriesRow1 = categories.slice(0, mid);
  const categoriesRow2 = categories.slice(mid);

  const renderCategoryGroup = (rows: typeof categories) => (
    <div className="bg-black p-4">
      <div className="bg-black text-white p-4">
        <div className="grid md:grid-cols-7 grid-cols-3 pb-4">
          {rows?.map((category, index) => (
            <div key={index} className="border-b-3 border-white">
              <span className="font-bold text-lg">{category?.title}</span>
              <div className="flex flex-col flex-wrap mt-2">
                {category?.items?.map((item: any, i) => (
                  <NavLink
                    key={i}
                    href={`/category/${category?.title}?sub=${item?.name}`}
                    className="py-1 text-sm leading-none hover:underline"
                  >
                    {item?.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <hr className="pb-5" />
      <div className="flex items-center mt-4 bg-black p-4">
        <input
          type="text"
          value={searchText}
          placeholder="search..."
          className="h-8 px-2 w-full bg-white border-none rounded-1 outline-none"
          onChange={handleInputChange}
        />
        <button
          onClick={handleSearch}
          className="h-8 bg-white text-black px-2 rounded-r flex items-center font-bold cursor-pointer"
        >
          Search <span className="ml-1 font-bold text-2xl pb-1">&#8594;</span>
        </button>
      </div>
      {renderCategoryGroup(categoriesRow1)}
      {renderCategoryGroup(categoriesRow2)}

      <div className="bg-black w-full pt-8 pb-8 px-5 flex flex-col items-start text white border-t border-b border-gray-700">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <NavLink href="/">
              <Image
                src={
                  "https://res.cloudinary.com/dqxcyhqvx/image/upload/v1753022225/Newsvistlogo_agfbuq.png"
                }
                alt="Newsvist Logo"
                width={120}
                height={32}
                className="w-auto h-8 mr-4"
              />
            </NavLink>
            <div className="font-bold text-2xl text-white">NG</div>
          </div>
          <div className="flex flex-wrap items-center w-full">
            <div className="border-r border-gray-500 w-1 h-6 mx-4"></div>
            {/* <div className="text-white text-[0.937rem] font-bold">
              Follow NEWSVIST
            </div>
            <NavLink
              href="https://web.facebook.com/profile.php?id=61563799709889"
              className="text-white text-[0.937rem] font-bold mx-4"
            >
              <Facebook />
            </NavLink>
            <NavLink
              href="https://x.com/verboxupdates"
              className="text-white text-[0.937rem] font-bold mx-4"
            >
              <XIcon size={35} />
            </NavLink>
            <NavLink
              href="/Instagram"
              className="text-white text-[0.937rem] font-bold mx-4"
            >
              <Instagram />
            </NavLink>
            <NavLink
              href="https://www.tiktok.com/@verboxupdates"
              className="text-white text-[0.937rem] font-bold mx-4"
            >
              <img
                src="images/Footer/Tiktok.png"
                className="h-full w-full"
                alt=""
              />
            </NavLink> */}
            {isLoggedIn === true ? (
              <button
                onClick={handleProfileClick}
                className="text-white p-1 rounded text-[0.937rem] border border-white font-bold"
              >
                Profile
              </button>
            ) : (
              <button className="border border-white rounded-xl px-4 py-2 ml-5 text-white hover:bg-gray-800">
                <NavLink href="/login">Log In</NavLink>
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="bg-black w-full text-white text-sm flex flex-wrap items-center justify-start pb-8 px-5">
        <NavLink href="/terms-of-use">Terms of Use</NavLink>
        <NavLink href="/privacy-policy" className="ml-4">
          Privacy Policy
        </NavLink>
        <NavLink href="/contact-Us" className="ml-4">
          Contact Us
        </NavLink>
        <NavLink href="/About" className="ml-4">
          About
        </NavLink>
      </div>
      <div className="bg-black w-full text-white text-sm flex flex-wrap items-center justify-center pb-8 px-5 gap-4">
        <p className="text-white text-sm">
          © {currentYear} News, Views, Insights, Stories & Trends. A Hidden
          Treasure Technologies. Discovery Company.
        </p>
        <p className="text-white text-sm">
          All Rights Reserved. NEWSVIST Nig ™ & © {currentYear} News, Views,
          Insights, Stories & Trends.
        </p>
      </div>
    </>
  );
};

export default Footer;
