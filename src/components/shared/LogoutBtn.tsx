"use client";

import { LogOutIcon, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState, memo } from "react";
import { authStorage } from "@/utils/auth/authStorage.util";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { clearSession } from "@/redux/slices/authentication";
import { showSuccessToast } from "./CustomToast";
import { cn } from "@/lib/utils";

export type LogoutBtnVariant = "plain" | "bordered" | "danger" | "ghost";

export interface LogoutBtnProps {
  withIcon?: boolean;
  variant?: LogoutBtnVariant;
  className?: string;
  children?: React.ReactNode;
}

const variantStyles: Record<LogoutBtnVariant, string> = {
  plain:
    "w-full flex items-center gap-2 hover:opacity-80 text-sm text-black-200",
  bordered:
    "w-auto border rounded p-2 flex items-center gap-2 text-sm text-text-primary-100 hover:bg-gray-100 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer",
  danger:
    "w-auto border border-red-200 text-red-600 rounded p-2 text-sm hover:bg-red-50 flex items-center gap-2 transition-all cursor-pointer",
  ghost:
    "w-auto px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 flex items-center gap-2 transition-all cursor-pointer",
};

export const LogoutBtn = memo(function LogoutBtn({
  withIcon = true,
  variant = "plain",
  className,
  children,
}: LogoutBtnProps) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang: locale,
        }),
      });

      const result = await res.json();

      if (result.isSuccess) {
        showSuccessToast({
          title: t("general.toast.title.success"),
          description: result.message,
          dismissText: t("general.toast.dismissText"),
        });

        dispatch(clearSession());
        authStorage.clear();

        // Refresh server components so they re-render without the session
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router, locale, t]);

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(variantStyles[variant], className)}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
      ) : (
        withIcon && <LogOutIcon className="w-4 h-4" />
      )}
      {children || <span>{t("components.LogoutBtn.logout")}</span>}
    </button>
  );
});
