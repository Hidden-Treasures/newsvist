"use client";

import Footer from "@/common/Footer";
import Header from "@/common/header";
import FifthSection from "@/home/FifthSection";
import FirstSection from "@/home/FirstSection";
import FourthSection from "@/home/FourthSection";
import SecondSection from "@/home/SecondSection";
import SeventhSection from "@/home/SeventhSection";
import SixthSection from "@/home/SixthSection";
import ThirdAdv from "@/home/ThirdAdv";
import { useState } from "react";

export default function Home() {
  const [showFooterSearch, setShowFooterSearch] = useState(false);
  const onSearchButtonClick = () => {
    setShowFooterSearch(!showFooterSearch);
  };

  return (
    <div className="overflow-x-hidden overflow-y-scroll hide-scrollbar">
      <Header onSearchButtonClick={onSearchButtonClick} />
      {!showFooterSearch && (
        <>
          <FirstSection />
          <SecondSection />
          <ThirdAdv />
          <FourthSection />
          <FifthSection />
          <SixthSection />
          <SeventhSection />
        </>
      )}
      <Footer />
    </div>
  );
}
