"use client";

import { LogOutIcon } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { signOut } from "next-auth/react";

export function LogoutBtn() {
  const t = useTranslations();
  const locale = useLocale();

  const handleLogout = async () => {
    await signOut({ callbackUrl: `/${locale}` });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 hover:opacity-80"
    >
      <LogOutIcon className="w-4 h-4" />
      {t("routes.home.components.UserAccountLinkMenu.logout")}
    </button>
  );
}
