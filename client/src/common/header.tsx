import React from "react";
import Navbar from "./navbar";
import Adv from "./Adv";
import LiveScore from "@/components/LiveScore";

interface HeaderProps {
  onSearchButtonClick?: () => void;
}

function Header({ onSearchButtonClick }: HeaderProps) {
  return (
    <>
      <Adv />
      <Navbar onSearchButtonClick={onSearchButtonClick} />
      <LiveScore />
    </>
  );
}

export default Header;
