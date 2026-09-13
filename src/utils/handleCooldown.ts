import { CreatorStore } from "@/types/creators/creatorStore";
import { CreatorStoreStatus } from "@/enums/creators/creatorStoreStatus.enum";
import { formatDate } from "./formatDate";

export const addDays = (date: Date | string, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const formatRelativeDays = (
  targetDate: Date | string,
  locale: string,
): string => {
  const target = new Date(targetDate);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const isArabic = locale.toLowerCase().includes("ar");

  if (diffDays <= 0) {
    return isArabic ? "اليوم" : "today";
  }

  try {
    const rtf = new Intl.RelativeTimeFormat(isArabic ? "ar-JO" : "en-US", {
      numeric: "auto",
    });
    return rtf.format(diffDays, "day");
  } catch {
    return isArabic ? `خلال ${diffDays} يوم` : `in ${diffDays} days`;
  }
};

export interface HandleCooldownState {
  isDraft: boolean;
  cooldownDays: number;
  nextAllowedDate: Date | null;
  isCooldownActive: boolean;
  formattedNextAllowedDate: string | null;
  relativeTimeText: string | null;
}

/**
 * Derives the handle cooldown state for a given CreatorStore.
 * Fallback cooldown period is 30 days if not otherwise specified.
 */
export const getHandleCooldownState = (
  store: CreatorStore | null | undefined,
  locale: string = "en",
  fallbackCooldownDays: number = 30, // Fallback cooldown in days
): HandleCooldownState => {
  if (!store) {
    return {
      isDraft: false,
      cooldownDays: fallbackCooldownDays,
      nextAllowedDate: null,
      isCooldownActive: false,
      formattedNextAllowedDate: null,
      relativeTimeText: null,
    };
  }

  const isDraft = store.status === CreatorStoreStatus.DRAFT;

  if (isDraft) {
    return {
      isDraft: true,
      cooldownDays: fallbackCooldownDays,
      nextAllowedDate: null,
      isCooldownActive: false,
      formattedNextAllowedDate: null,
      relativeTimeText: null,
    };
  }

  let nextAllowedDate: Date | null = null;

  if (store.nextChangeAllowedAt) {
    nextAllowedDate = new Date(store.nextChangeAllowedAt);
  } else if (store.handleChangedAt) {
    nextAllowedDate = addDays(store.handleChangedAt, fallbackCooldownDays);
  }

  const isCooldownActive = Boolean(
    nextAllowedDate && nextAllowedDate.getTime() > Date.now(),
  );

  return {
    isDraft: false,
    cooldownDays: fallbackCooldownDays,
    nextAllowedDate,
    isCooldownActive,
    formattedNextAllowedDate: nextAllowedDate
      ? formatDate(nextAllowedDate, locale)
      : null,
    relativeTimeText: nextAllowedDate
      ? formatRelativeDays(nextAllowedDate, locale)
      : null,
  };
};
