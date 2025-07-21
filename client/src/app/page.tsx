"use client";

import Header from "@/common/header";
import { useState } from "react";

export default function Home() {
  const [showFooterSearch, setShowFooterSearch] = useState(false);
  const onSearchButtonClick = () => {
    setShowFooterSearch(!showFooterSearch);
  };

  return (
    <>
      <Header onSearchButtonClick={onSearchButtonClick} />
      {!showFooterSearch && <></>}
    </>
  );
}
