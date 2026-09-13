"use client";

import React, { memo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  AlertTriangle,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  Landmark,
  MapPin,
  Palette,
  Building2,
  Pencil,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import { CreatorStore } from "@/types/creators/creatorStore";
import { CreatorStoreBusinessType } from "@/enums/creators/creatorStoreBusinessType.enum";
import { useSubmitForReviewMutation } from "@/hooks/react-query/creators/useSubmitForReviewMutation";

interface SubmitForReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  store: CreatorStore;
}

const SubmitForReviewDialog: React.FC<SubmitForReviewDialogProps> = ({
  isOpen,
  onClose,
  store,
}) => {
  const t = useTranslations(
    "routes.creators.routes.dashboard.components.CreatorsDashboardPageContainer.reviewDialog",
  );
  const locale = useLocale();
  const isAr = isArabicLocale(locale);
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const submitMutation = useSubmitForReviewMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      if (e.key === "Escape" && !submitMutation.isPending) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, submitMutation.isPending, onClose]);

  if (!isOpen || !mounted) return null;

  // Validation Checks
  const hasPayout = Boolean(
    store.payoutInfo?.bankName?.trim() &&
    store.payoutInfo?.accountHolderName?.trim() &&
    store.payoutInfo?.iban?.trim() &&
    store.payoutInfo?.accountNumber?.trim(),
  );

  const hasPickup = Boolean(
    store.pickupAddress?.country?.trim() &&
    store.pickupAddress?.city?.trim() &&
    store.pickupAddress?.street?.trim() &&
    store.pickupAddress?.building?.trim(),
  );

  const hasBranding = Boolean(
    store.logo?.url &&
    store.banner?.url &&
    store.name?.ar?.trim() &&
    store.name?.en?.trim() &&
    store.handle?.trim(),
  );

  const isCompany = store.businessType === CreatorStoreBusinessType.COMPANY;
  const hasCompanyDocs = isCompany
    ? Boolean(store.registrationNumber?.trim() && store.taxId?.trim())
    : true;

  const isReady = hasPayout && hasPickup && hasBranding && hasCompanyDocs;

  const handleSubmit = async () => {
    if (!isReady) return;
    await submitMutation.mutateAsync();
    onClose();
  };

  const checklistItems = [
    {
      id: "payout",
      label: t("checklist.payout"),
      desc: t("checklist.payoutDesc"),
      icon: Landmark,
      isComplete: hasPayout,
    },
    {
      id: "pickup",
      label: t("checklist.pickup"),
      desc: t("checklist.pickupDesc"),
      icon: MapPin,
      isComplete: hasPickup,
    },
    {
      id: "branding",
      label: t("checklist.branding"),
      desc: t("checklist.brandingDesc"),
      icon: Palette,
      isComplete: hasBranding,
    },
    ...(isCompany
      ? [
          {
            id: "company",
            label: t("checklist.company"),
            desc: t("checklist.companyDesc"),
            icon: Building2,
            isComplete: hasCompanyDocs,
          },
        ]
      : []),
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      dir={isAr ? "rtl" : "ltr"}
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (!submitMutation.isPending) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg bg-white-50 rounded-3xl p-6 sm:p-7 shadow-2xl border border-gray-100 overflow-hidden space-y-6 text-start animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                isReady
                  ? "bg-purple-50 text-purple-600"
                  : "bg-amber-50 text-amber-600"
              }`}
            >
              {isReady ? (
                <Sparkles className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">
                {isReady ? t("titleReady") : t("titleIncomplete")}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isReady ? t("descReady") : t("descIncomplete")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitMutation.isPending}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5">
          {checklistItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`flex items-start justify-between p-3.5 rounded-2xl border transition-all ${
                  item.isComplete
                    ? "bg-emerald-50/40 border-emerald-100 text-emerald-950"
                    : "bg-red-50/40 border-red-100 text-red-950"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.isComplete
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">{item.label}</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold pt-1">
                  {item.isComplete ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">
                        {t("status.complete")}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-600">
                        {t("status.missing")}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Ready Recap Summary */}
        {isReady && (
          <div className="rounded-2xl bg-gray-50 border border-gray-200/80 p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500">{t("recap.storeLabel")}</span>
              <span className="font-semibold text-gray-800">
                {isAr ? store.name?.ar : store.name?.en} (@{store.handle})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-200/60">
              <span className="text-gray-500">{t("recap.payoutLabel")}</span>
              <span className="font-semibold text-gray-800">
                {store.payoutInfo?.bankName} (
                {store.payoutInfo?.iban?.slice(0, 8)}...)
                {store.payoutInfo?.cliqAlias &&
                  ` • CliQ: ${store.payoutInfo.cliqAlias}`}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-500">{t("recap.pickupLabel")}</span>
              <span className="font-semibold text-gray-800">
                {store.pickupAddress?.city}, {store.pickupAddress?.country}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={submitMutation.isPending}
            className="rounded-xl border-gray-300 text-xs font-semibold px-4 h-10"
          >
            {t("actions.cancel")}
          </Button>

          {!isReady ? (
            <Link
              href={`/${locale}/creators/dashboard/store/edit`}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 h-10 text-xs font-bold text-white-50 hover:bg-purple-700 shadow-sm transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>{t("actions.goToEdit")}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white-50 text-xs font-bold px-6 h-10 shadow-sm transition-all inline-flex items-center gap-2"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("actions.submitting")}</span>
                </>
              ) : (
                <>
                  <span>{t("actions.submitConfirm")}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default memo(SubmitForReviewDialog);
