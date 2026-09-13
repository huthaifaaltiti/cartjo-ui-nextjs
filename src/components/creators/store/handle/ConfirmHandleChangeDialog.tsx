"use client";

import React, { memo, useEffect } from "react";
import { AlertTriangle, X, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";

interface ConfirmHandleChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  oldHandle: string;
  newHandle: string;
  cooldownDays: number;
  projectedDateFormatted: string;
  isLoading: boolean;
}

const ConfirmHandleChangeDialog: React.FC<ConfirmHandleChangeDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  oldHandle,
  newHandle,
  cooldownDays,
  projectedDateFormatted,
  isLoading,
}) => {
  const t = useTranslations(
    "routes.creators.dashboard.routes.store.components.ConfirmHandleChangeDialog",
  );
  const locale = useLocale();
  const isAr = isArabicLocale(locale);
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-handle-dialog-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200"
        dir={isAr ? "rtl" : "ltr"}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
            aria-label={t("close") || "Close"}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-6">
          <h2
            id="confirm-handle-dialog-title"
            className="text-lg font-bold text-gray-900"
          >
            {t("title", { newHandle: `@${newHandle}` })}
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            {t("description", {
              oldHandle: `@${oldHandle}`,
              newHandle: `@${newHandle}`,
              cooldownDays,
              projectedDate: projectedDateFormatted,
            })}
          </p>

          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 space-y-1">
            <p className="font-semibold flex items-center gap-1.5">
              <span>⚠️</span>
              {t("warningHeading") || "Important warning"}
            </p>
            <p className="text-amber-800 leading-normal">
              {t("warningNote", {
                oldLink: `/@${oldHandle}`,
                newLink: `/@${newHandle}`,
              })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {t("cancelBtn") || "Cancel"}
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 text-sm font-semibold shadow-xs transition-all inline-flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t("changingBtn") || "Changing..."}</span>
              </>
            ) : (
              <>
                <span>{t("confirmBtn") || "Change handle"}</span>
                <ArrowIcon className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(ConfirmHandleChangeDialog);
