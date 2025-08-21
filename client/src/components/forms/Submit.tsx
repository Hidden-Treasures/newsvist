"use client";
import React, { MouseEventHandler } from "react";
import { Loader } from "react-feather";
import { Button } from "../ui/button";

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
    <Button
      type={type}
      className="w-full rounded text-white bg-blue-600 hover:bg-blue-900 transition font-semibold text-lg cursor-pointer h-10 flex items-center justify-center"
      onClick={onClick}
    >
      {busy ? <Loader className="animate-spin" /> : value}
    </Button>
  );
}
