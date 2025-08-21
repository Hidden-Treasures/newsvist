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
      <div
        className="bg-slate-950 border border-slate-800 
          rounded-2xl shadow-lg w-[45rem] max-w-[95vw] max-h-[85vh] overflow-y-auto hide-scrollbar p-6"
      >
        {children}
      </div>
    );
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleClick}
      id="modal-container"
      className={`fixed inset-0 z-50 backdrop-blur-md bg-white/5 flex items-center justify-center px-4 ${className}`}
    >
      {renderChildren()}
    </div>
  );
}
