"use client";
import React, { MouseEvent, MouseEventHandler } from "react";
import { Loader } from "react-feather";

interface SubmitProps {
  value: string;
  busy?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export default function Submit({
  value,
  busy = false,
  type = "submit",
  onClick,
}: SubmitProps) {
  return (
    <button
      type={type}
      className="w-full rounded bg-secondary text-white hover:bg-opacity-90 transition font-semibold text-lg cursor-pointer h-10 flex items-center justify-center"
      onClick={onClick}
    >
      {busy ? <Loader className="animate-spin" /> : value}
    </button>
  );
}
