import { cn } from "@/utils/utils";
import * as React from "react";

type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
};

export function Label({ children, htmlFor, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn("block text-sm font-medium text-gray-700", className)}
    >
      {children}
    </label>
  );
}
