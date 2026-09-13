"use client";

import React, { memo } from "react";
import { useTranslations } from "next-intl";
import {
  Info,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  HandleAvailabilityData,
  HandleAvailabilityReason,
} from "@/types/creators/creatorStore";
import { validationConfig } from "@/config/validationConfig";

export interface HandleAvailabilityStatusProps {
  handle: string;
  isFormatValid: boolean;
  isAvailabilityLoading: boolean;
  isAvailabilityError: boolean;
  isSameAsCurrent?: boolean;
  availabilityResult?: HandleAvailabilityData | null;
  onRetry?: () => void;
  className?: string;
}

const HandleAvailabilityStatus: React.FC<HandleAvailabilityStatusProps> = ({
  handle,
  isFormatValid,
  isAvailabilityLoading,
  isAvailabilityError,
  isSameAsCurrent = false,
  availabilityResult,
  onRetry,
  className = "",
}) => {
  const t = useTranslations(
    "routes.creators.routes.dashboard.routes.store.components.StoreHandleCard",
  );
  const tc = useTranslations(
    "routes.creators.routes.dashboard.routes.store.routes.create.form",
  );

  const cleanHandle = handle ? handle.trim() : "";
  const { handleMinChars, handleMaxChars } = validationConfig.creatorStore;

  return (
    <div
      className={`min-h-6 flex items-center text-xs ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {!cleanHandle || cleanHandle.length < handleMinChars ? (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>
            {tc("validations.handleTooShort", { min: handleMinChars }) ||
              t("validation.tooShort", { min: handleMinChars }) ||
              `Handle must be at least ${handleMinChars} characters.`}
          </span>
        </div>
      ) : !isFormatValid ? (
        <div className="flex items-center gap-1.5 text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleInvalid", {
              min: handleMinChars,
              max: handleMaxChars,
            }) ||
              t("validation.invalidFormat") ||
              `Only lowercase letters, numbers, - and _. Must be ${handleMinChars}-${handleMaxChars} characters.`}
          </span>
        </div>
      ) : isSameAsCurrent ? (
        <div className="flex items-center gap-1.5 text-gray-500">
          <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span>
            {t("validation.sameAsCurrent") || "This is your current handle."}
          </span>
        </div>
      ) : isAvailabilityLoading ? (
        <div className="flex items-center gap-1.5 text-purple-600 font-medium">
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
          <span>
            {tc("validations.handleChecking") ||
              t("validation.checking") ||
              "Checking availability…"}
          </span>
        </div>
      ) : isAvailabilityError ? (
        <div className="flex items-center gap-2 text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleNetworkError") ||
              t("validation.networkError") ||
              "Couldn't check availability."}
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="underline font-semibold text-rose-700 hover:text-rose-800"
            >
              {tc("validations.handleRetry") ||
                t("validation.retry") ||
                "Retry"}
            </button>
          )}
        </div>
      ) : availabilityResult?.reason === HandleAvailabilityReason.AVAILABLE ? (
        <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleAvailable", { handle: `@${cleanHandle}` }) ||
              t("validation.available", { handle: `@${cleanHandle}` }) ||
              `@${cleanHandle} is available.`}
          </span>
        </div>
      ) : availabilityResult?.reason === HandleAvailabilityReason.TAKEN ? (
        <div className="flex items-center gap-1.5 text-rose-600">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleTaken", { handle: `@${cleanHandle}` }) ||
              t("validation.taken", { handle: `@${cleanHandle}` }) ||
              `@${cleanHandle} is already taken.`}
          </span>
        </div>
      ) : availabilityResult?.reason === HandleAvailabilityReason.RESERVED ? (
        <div className="flex items-center gap-1.5 text-rose-600">
          <XCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleReserved") ||
              t("validation.reserved") ||
              "This handle is reserved and can't be used."}
          </span>
        </div>
      ) : availabilityResult?.reason === HandleAvailabilityReason.INVALID ? (
        <div className="flex items-center gap-1.5 text-rose-600">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleInvalid", {
              min: handleMinChars,
              max: handleMaxChars,
            }) ||
              t("validation.invalidFormat") ||
              `Only lowercase letters, numbers, - and _. Must be ${handleMinChars}-${handleMaxChars} characters.`}
          </span>
        </div>
      ) : availabilityResult?.reason ===
        HandleAvailabilityReason.RECENTLY_RELEASED ? (
        <div className="flex items-center gap-1.5 text-amber-700">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            {tc("validations.handleRecentlyReleased") ||
              t("validation.recentlyReleased") ||
              "This handle was recently used by another store and isn't available yet."}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default memo(HandleAvailabilityStatus);
