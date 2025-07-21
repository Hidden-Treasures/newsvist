"use client";
import React, { ReactNode, MouseEvent } from "react";

interface ModalContainerProps {
  visible: boolean;
  ignoreContainer?: boolean;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function ModalContainer({
  visible,
  ignoreContainer = false,
  children,
  onClose,
  className = "",
}: ModalContainerProps) {
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-container") {
      onClose?.();
    }
  };

  const renderChildren = () => {
    if (ignoreContainer) return children;

    return (
      <div className="bg-white rounded w-[45rem] h-[40rem] overflow-auto p-2 custom-scroll-bar">
        {children}
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className={`fixed inset-0 bg-primary bg-opacity-50 backdrop-blur-sm flex items-center justify-center ${className}`}
    >
      {renderChildren()}
    </div>
  );
}
