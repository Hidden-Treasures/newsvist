"use client";

import React, { useState, useEffect } from "react";

type NewUpdateBannerProps = {
  newUpdate: boolean;
};

const NewUpdateBanner: React.FC<NewUpdateBannerProps> = ({ newUpdate }) => {
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    setShowBanner(newUpdate);
  }, [newUpdate]);

  const handleBannerClick = () => {
    setShowBanner(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (window.scrollY === 0) {
      setShowBanner(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const bannerStyle: React.CSSProperties = {
    display: showBanner ? "block" : "none",
    fontSize: "0.8rem",
    background: "red",
    color: "white",
    paddingBottom: "8px",
    paddingTop: "8px",
    paddingLeft: "14px",
    paddingRight: "14px",
    position: "fixed",
    top: "25%",
    fontWeight: "bold",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    borderRadius: "50px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
  };

  return showBanner ? (
    <div style={bannerStyle} onClick={handleBannerClick}>
      <span>&#8593;</span>
      <span className="ml-2">A New Update</span>
    </div>
  ) : null;
};

export default NewUpdateBanner;
