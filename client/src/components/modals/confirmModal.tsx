import React from "react";
import { Loader } from "react-feather";
import ModalContainer from "./Container";

interface ConfirmModalProps {
  visible: boolean;
  busy?: boolean;
  title: string;
  subtitle?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  busy = false,
  title,
  subtitle,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const commonClass = "px-3 py-1 text-white rounded cursor-pointer";

  return (
    <ModalContainer visible={visible} ignoreContainer>
      <div className="dark:bg-black bg-white rounded p-3">
        <h1 className="text-red-400 font-semibold text-lg">{title}</h1>
        {subtitle && (
          <p className="text-red-300 dark:text-white text-sm">{subtitle}</p>
        )}

        <div className="flex items-center space-x-3 mt-3">
          {busy ? (
            <p className="flex items-center space-x-2 text-primary dark:text-white">
              <Loader className="animate-spin" />
              <span>Please wait</span>
            </p>
          ) : (
            <>
              <button
                onClick={onConfirm}
                type="button"
                className={commonClass + " bg-red-400 hover:bg-red-500"}
              >
                Confirm
              </button>
              <button
                onClick={onCancel}
                type="button"
                className={commonClass + " bg-blue-400 hover:bg-blue-500"}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
