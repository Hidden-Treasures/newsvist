import React from "react";
import { Loader } from "react-feather";
import ModalContainer from "./Container";
import { Button } from "../ui/button";

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
      <div className="w-full max-w-md mx-auto bg-white dark:bg-slate-950 rounded-2xl shadow-xl p-6 border border-slate-200 dark:border-slate-800">
        {/* Header */}
        <h1 className="text-xl font-semibold text-red-500 dark:text-red-400">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {subtitle}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-6">
          {busy ? (
            <div className="flex items-center gap-2 text-primary dark:text-slate-200">
              <Loader className="animate-spin w-5 h-5" />
              <span className="text-sm font-medium">Please wait…</span>
            </div>
          ) : (
            <>
              <Button
                variant={"outline"}
                onClick={onCancel}
                type="button"
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                type="button"
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium shadow-sm transition"
              >
                Confirm
              </Button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
