/**
 * Authentication Guard Hook
 *
 * This hook provides client-side authentication protection utilities using NextAuth session data.
 * It helps control access to sensitive actions and routes by validating user authentication status
 * and access tokens before executing protected operations.
 *
 * Features:
 * - Checks authentication session status
 * - Validates presence of access token
 * - Shows user-friendly login required notifications
 * - Redirects unauthenticated users to login page
 * - Preserves current route and query parameters for post-login redirection
 *
 * Usage:
 * - Call `requireAuth()` to enforce authentication with automatic login redirection.
 * - Call `requireAuthWithoutRedirect()` to only show a warning message without navigation.
 */

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/authOptions";
import { showWarningToast } from "@/components/shared/CustomToast";
import { useLocale, useTranslations } from "next-intl";

export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data, status } = useSession();
  const t = useTranslations("");
  const locale = useLocale()


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

  const isAuthenticated = () => {
    if (status === "loading") return false;

    if (status === "unauthenticated") return false;

    const token = (data as CustomSession)?.accessToken;

    return Boolean(token);
  };

  const requireAuth = () => {
    if (isAuthenticated()) return true;

    showLoginRequiredToast();
    redirectToLogin(true);

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
    session: data as CustomSession | null,
    status,
    isAuthenticated,
  };
}