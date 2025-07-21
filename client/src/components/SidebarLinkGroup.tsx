import React, { useState, ReactNode, FC } from "react";

interface SidebarLinkGroupProps {
  activeCondition: boolean;
  children: (handleClick: () => void, open: boolean) => ReactNode;
}

const SidebarLinkGroup: FC<SidebarLinkGroupProps> = ({
  activeCondition,
  children,
}) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <li
      className={`px-3 py-2 rounded-sm mb-0.5 last:mb-0 list-none ${
        activeCondition ? "bg-slate-900" : ""
      }`}
    >
      {children(handleClick, open)}
    </li>
  );
};

export default SidebarLinkGroup;
