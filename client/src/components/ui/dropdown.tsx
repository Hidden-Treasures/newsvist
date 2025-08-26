"use client";

import { Fragment, ReactNode } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { cn } from "@/utils/utils";

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {children}
    </Menu>
  );
}

export function DropdownMenuTrigger({
  children,
}: {
  asChild?: boolean;
  children: React.ReactNode;
}) {
  return <MenuButton as={Fragment}>{children}</MenuButton>;
}

export function DropdownMenuContent({
  align = "start",
  className = "",
  children,
}: {
  align?: "start" | "end";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <MenuItems
        className={cn(
          "absolute z-50 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
          align === "end" ? "right-0" : "left-0",
          className
        )}
      >
        {children}
      </MenuItems>
    </Transition>
  );
}

export function DropdownMenuItem({
  children,
  className = "",
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <MenuItem>
      <button
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "flex w-full items-center px-3 py-2 text-sm text-gray-700 rounded-md transition-colors",
          "data-[active]:bg-gray-100",
          className
        )}
      >
        {children}
      </button>
    </MenuItem>
  );
}

export function DropdownMenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-2 text-sm font-semibold text-gray-500">
      {children}
    </div>
  );
}

export function DropdownMenuSeparator() {
  return <div className="my-1 h-px bg-gray-200" />;
}
