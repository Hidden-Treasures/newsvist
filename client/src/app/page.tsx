"use client";

import Header from "@/common/header";
import FirstSection from "@/home/FirstSection";
import SecondSection from "@/home/SecondSection";
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
        </>
      )}
    </div>
  );
}
