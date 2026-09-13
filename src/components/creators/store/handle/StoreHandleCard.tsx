"use client";

import React, { memo, useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  AtSign,
  Copy,
  Check,
  Edit2,
  X,
  Loader2,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreatorStore } from "@/types/creators/creatorStore";
import { useHandleAvailabilityQuery } from "@/hooks/react-query/creators/useHandleAvailabilityQuery";
import { useChangeHandleMutation } from "@/hooks/react-query/creators/useChangeHandleMutation";
import { getHandleCooldownState, addDays } from "@/utils/handleCooldown";
import { formatDate } from "@/utils/formatDate";
import { showSuccessToast } from "@/components/shared/CustomToast";
import { validationConfig } from "@/config/validationConfig";
import ConfirmHandleChangeDialog from "./ConfirmHandleChangeDialog";
import HandleAvailabilityStatus from "./HandleAvailabilityStatus";

interface StoreHandleCardProps {
  store: CreatorStore;
  className?: string;
}

const StoreHandleCard: React.FC<StoreHandleCardProps> = ({
  store,
  className = "",
}) => {
  const t = useTranslations(
    "routes.creators.routes.dashboard.routes.store.components.StoreHandleCard",
  );
  const tg = useTranslations("general");
  const locale = useLocale();

  const currentHandle = (store.handle || "").toLowerCase().trim();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputHandle, setInputHandle] = useState<string>(currentHandle);
  const [copied, setCopied] = useState<boolean>(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const cooldownState = getHandleCooldownState(store, locale);
  const {
    isDraft,
    isCooldownActive,
    cooldownDays,
    formattedNextAllowedDate,
    relativeTimeText,
  } = cooldownState;

  const changeHandleMutation = useChangeHandleMutation();

  const {
    data: availabilityData,
    isLoading: isCheckingAvailability,
    isFetching,
    isError: isAvailabilityError,
    refetch: refetchAvailability,
    isDebouncing,
    isFormatValid,
    isSameAsCurrent,
  } = useHandleAvailabilityQuery({
    handle: inputHandle,
    enabled:
      isEditing &&
      inputHandle.length >= validationConfig.creatorStore.handleMinChars,
    currentHandle,
  });

  // Keep input synchronized if store.handle changes
  useEffect(() => {
    if (!isEditing) {
      setInputHandle(currentHandle);
    }
  }, [currentHandle, isEditing]);

  // Focus & select input on enter edit mode
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleCopyUrl = async () => {
    if (typeof window === "undefined") return;
    const origin = window.location.origin;
    const publicUrl = `${origin}/creators/@${currentHandle}`;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      showSuccessToast({
        title: t("messages.copiedTitle") || "Copied to clipboard",
        description: publicUrl,
        dismissText: tg("toast.dismissText"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API fails
      setCopied(false);
    }
  };

  const handleStartEdit = () => {
    if (isCooldownActive) return;
    setInputHandle(currentHandle);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setInputHandle(currentHandle);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-lowercase and trim spaces
    const clean = e.target.value.toLowerCase().replace(/\s+/g, "");
    setInputHandle(clean);
  };

  const isAvailabilityLoading =
    isCheckingAvailability || isFetching || isDebouncing;
  const availabilityResult = availabilityData?.data;
  const isAvailable =
    isFormatValid &&
    !isSameAsCurrent &&
    availabilityResult?.available === true &&
    availabilityResult?.reason === "AVAILABLE";

  const isSaveEnabled =
    isFormatValid &&
    !isSameAsCurrent &&
    !isAvailabilityLoading &&
    isAvailable &&
    !changeHandleMutation.isPending;

  const handleSaveClick = () => {
    if (!isSaveEnabled) return;

    if (isDraft) {
      // DRAFT stores skip confirmation and change directly
      executeChangeHandle();
    } else {
      // Open confirm dialog
      setIsConfirmOpen(true);
    }
  };

  const executeChangeHandle = () => {
    changeHandleMutation.mutate(
      { handle: inputHandle },
      {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setIsEditing(false);
        },
      },
    );
  };

  const projectedCooldownDate = addDays(new Date(), cooldownDays);
  const projectedDateFormatted = formatDate(projectedCooldownDate, locale);

  const originUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/${locale}/@${currentHandle}`
      : `https://cartjo.com/${locale}/@${currentHandle}`;

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white-50 p-6 shadow-2xs transition-all ${className}`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <AtSign className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              {t("cardTitle") || "Store Handle & Vanity URL"}
            </h3>
            <p className="text-xs text-gray-500">
              {t("cardSubtitle") ||
                "Your public address and profile URL across CartJO."}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        {isDraft ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {t("badges.draft")}
          </span>
        ) : isCooldownActive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            {t("badges.cooldownActive")}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t("badges.changeAvailable")}
          </span>
        )}
      </div>

      {/* Body Area */}
      <div className="pt-5 space-y-4">
        {!isEditing ? (
          /* STATE A: Read-Only View */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-gray-50/70 border border-gray-200/70">
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-gray-900 font-mono tracking-tight truncate">
                    @{currentHandle}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-mono truncate">
                  <span className="truncate">{originUrl}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyUrl}
                  className="rounded-xl border-gray-200 text-xs font-medium text-gray-700 hover:bg-white-50 inline-flex items-center gap-1.5 h-9"
                  title={t("actions.copyUrl")}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">
                        {t("actions.copied")}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-500" />
                      <span>{t("actions.copyUrl")}</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleStartEdit}
                  disabled={isCooldownActive}
                  title={
                    isCooldownActive
                      ? t("hints.cooldownDisabledTooltip", {
                          date: formattedNextAllowedDate ?? "",
                          relative: relativeTimeText ?? "",
                        }) ||
                        `Your handle can be changed again on ${formattedNextAllowedDate ?? ""} (${relativeTimeText ?? ""}).`
                      : t("actions.editHandle") || "Edit handle"
                  }
                  className={`rounded-xl px-3.5 h-9 text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    isCooldownActive
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none hover:bg-gray-100"
                      : "bg-purple-600 hover:bg-purple-700 text-white-50 shadow-xs cursor-pointer"
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{t("actions.editHandle")}</span>
                </Button>
              </div>
            </div>

            {/* Muted Guidance Hint */}
            <div className="text-xs text-gray-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {isDraft
                  ? t("hints.draftHint")
                  : isCooldownActive
                    ? t("hints.cooldownActiveHint", {
                        date: formattedNextAllowedDate ?? "",
                        relative: relativeTimeText ?? "",
                      })
                    : t("hints.cooldownAllowedHint", { cooldownDays })}
              </p>
            </div>
          </div>
        ) : (
          /* STATE B: Edit Mode */
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="space-y-2">
              <label
                htmlFor="store-handle-input"
                className="text-sm font-semibold text-gray-800"
              >
                {t("form.label")}
              </label>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span
                    className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-mono text-sm rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-3.5"
                    aria-hidden="true"
                  >
                    @
                  </span>
                  <Input
                    id="store-handle-input"
                    ref={inputRef}
                    type="text"
                    value={inputHandle}
                    onChange={handleInputChange}
                    placeholder="your-handle"
                    maxLength={validationConfig.creatorStore.handleMaxChars}
                    disabled={changeHandleMutation.isPending}
                    className="pl-8 rtl:pl-3 rtl:pr-8 font-mono text-sm lowercase h-11 rounded-xl border-gray-300 focus:border-purple-600 focus:ring-purple-600/20"
                    dir="ltr"
                    autoComplete="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={changeHandleMutation.isPending}
                  className="rounded-xl border-gray-300 h-11 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  <X className="w-3.5 h-3.5 mr-1 rtl:mr-0 rtl:ml-1" />
                  {t("form.cancelBtn")}
                </Button>

                <Button
                  type="button"
                  onClick={handleSaveClick}
                  disabled={!isSaveEnabled}
                  className={`rounded-xl h-11 px-5 text-xs font-semibold inline-flex items-center gap-1.5 transition-all ${
                    isSaveEnabled
                      ? "bg-purple-600 hover:bg-purple-700 text-white-50 shadow-xs cursor-pointer"
                      : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  }`}
                >
                  {changeHandleMutation.isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t("form.savingBtn")}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("form.saveBtn")}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Inline Status Line with aria-live="polite" */}
              <HandleAvailabilityStatus
                handle={inputHandle}
                isFormatValid={isFormatValid}
                isAvailabilityLoading={isAvailabilityLoading}
                isAvailabilityError={isAvailabilityError}
                isSameAsCurrent={isSameAsCurrent}
                availabilityResult={availabilityResult}
                onRetry={() => refetchAvailability()}
                className="pt-1.5"
              />
            </div>

            {/* Public URL preview while editing */}
            {isFormatValid && (
              <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs text-purple-900 flex items-center justify-between">
                <div className="truncate">
                  <span className="text-purple-600 font-medium mr-1 rtl:mr-0 rtl:ml-1">
                    {t("form.previewLabel") || "New URL preview:"}
                  </span>
                  <span className="font-mono font-semibold truncate">
                    {typeof window !== "undefined"
                      ? window.location.origin
                      : "https://cartjo.com"}
                    /{locale}/@{inputHandle}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog (State C) */}
      <ConfirmHandleChangeDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={executeChangeHandle}
        oldHandle={currentHandle}
        newHandle={inputHandle}
        cooldownDays={cooldownDays}
        projectedDateFormatted={projectedDateFormatted}
        isLoading={changeHandleMutation.isPending}
      />
    </div>
  );
};

export default memo(StoreHandleCard);
