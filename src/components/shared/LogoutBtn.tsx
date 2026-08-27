"use client";

import { LogOutIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";
import { authStorage } from "@/utils/auth/authStorage.util";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { clearSession } from "@/redux/slices/authentication";
import { showSuccessToast } from "./CustomToast";

export function LogoutBtn({ withIcon = true }: { withIcon?: boolean }) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = useCallback(async () => {
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
  }, [dispatch, router, locale, t]);

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 hover:opacity-80 text-sm text-black-200"
    >
      {withIcon && <LogOutIcon className="w-4 h-4" />}
      {t("routes.home.components.UserAccountLinkMenu.logout")}
    </button>
  );
}
