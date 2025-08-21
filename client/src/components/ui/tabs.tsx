"use client";

import * as React from "react";
import { Tab } from "@headlessui/react";
import { cn } from "@/utils/utils";

// Tabs container
export function Tabs({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) {
  // Make children into an array and cast them as ReactElement
  const tabs = React.Children.toArray(children).filter(
    (child): child is React.ReactElement<any> =>
      React.isValidElement(child) &&
      (child.type as any).displayName === "TabsTrigger"
  );

  const [selectedIndex, setSelectedIndex] = React.useState(
    tabs.findIndex((t) => t.props.value === defaultValue) || 0
  );

  return (
    <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
      <div className={cn("w-full", className)}>{children}</div>
    </Tab.Group>
  );
}

// TabsList
export function TabsList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tab.List className={cn("flex gap-2", className)}>{children}</Tab.List>
  );
}

// TabsTrigger
export function TabsTrigger({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tab
      className={({ selected }) =>
        cn(
          "px-3 py-1.5 text-sm rounded-md transition",
          selected
            ? "bg-slate-800 text-white"
            : "text-gray-400 hover:text-white hover:bg-slate-700",
          className
        )
      }
    >
      {children}
    </Tab>
  );
}
TabsTrigger.displayName = "TabsTrigger";

// TabsContent
export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tab.Panels>
      <Tab.Panel className={cn("mt-4", className)}>{children}</Tab.Panel>
    </Tab.Panels>
  );
}
TabsContent.displayName = "TabsContent";
