"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { showWarningToast } from "@/components/shared/CustomToast";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { CartJOSession } from "@/types/cartjoSession.type";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { isAuthenticated: isSessionAuthenticated, session } = useSelector(
    (state: RootState) => state.authentication,
  );

  const t = useTranslations("");
  const locale = useLocale();

  const buildRedirectPath = () => {
    const queryString = searchParams.toString();
    const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

    return encodeURIComponent(fullPath);
  };

  const showLoginRequiredToast = () => {
    showWarningToast({
      title: t("general.toast.title.error"),
      description: t("general.toast.description.loginRequired"),
      dismissText: t("general.toast.dismissText"),
    });
  };

  const redirectToLogin = (withRedirect: boolean = true) => {
    if (withRedirect) {
      const redirectTo = buildRedirectPath();

      router.push(`/${locale}/auth?redirectTo=${redirectTo}&resend=true`);
    } else {
      router.push(`${locale}/auth?resend=false`);
    }
  };

  const isAuthenticated = () => isSessionAuthenticated;

  const requireAuth = () => {
    if (isAuthenticated()) return true;

    showLoginRequiredToast();
    redirectToLogin();

    return false;
  };

  const requireAuthWithoutRedirect = () => {
    if (isAuthenticated()) return true;

    showLoginRequiredToast();

    return false;
  };

  return {
    requireAuth,
    requireAuthWithoutRedirect,
    session: session as CartJOSession | null,
    status,
    isAuthenticated,
  };
}
