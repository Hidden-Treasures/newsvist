"use client";

import { Colors } from "@/utils/Colors";
import React, { FC, ReactNode } from "react";

interface LabelProps {
  children: ReactNode;
  htmlFor: string;
}

const Label: FC<LabelProps> = ({ children, htmlFor }) => {
  return (
    <label
      htmlFor={htmlFor}
      className="font-semibold"
      style={{ color: Colors.secondary }}
    >
      {children}
    </label>
  );
};

export default Label;
