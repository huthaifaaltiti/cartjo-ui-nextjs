"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useTranslations } from "next-intl";
import AuthCallbackView from "./AuthCallbackView";
import { showErrorToast } from "@/components/shared/CustomToast";

type AuthStatus = "idle" | "loading" | "success" | "error";

const AuthCallbackHandler = () => {
  const router = useRouter();
  const t = useTranslations();

  const handledRef = useRef(false);

  const [status, setStatus] = useState<AuthStatus>("idle");

  const [accessToken] = useQueryState("accessToken", {
    defaultValue: "",
  });
  const [refreshToken] = useQueryState("refreshToken", {
    defaultValue: "",
  });
  const [authError] = useQueryState("authError", {
    defaultValue: "",
  });
  const [provider] = useQueryState("provider", {
    defaultValue: "",
  });
  const [redirectTo] = useQueryState("redirectTo", {
    defaultValue: "",
  });

  const authErrorMessages: Record<string, string> = useMemo(
    () => ({
      GOOGLE_NO_CODE: t(
        "routes.auth.components.AuthTabs.components.login.errors.google.noCode",
      ),
      GOOGLE_EMAIL_MISSING: t(
        "routes.auth.components.AuthTabs.components.login.errors.google.emailMissing",
      ),
      GOOGLE_AUTH_FAILED: t(
        "routes.auth.components.AuthTabs.components.login.errors.google.failed",
      ),
    }),
    [t],
  );

  // Handle backend OAuth errors
  useEffect(() => {
    if (!authError) return;

    setStatus("error");

    showErrorToast({
      title: t("general.toast.title.error"),
      description:
        authErrorMessages[authError] || t("general.toast.defaultError"),
      dismissText: t("general.toast.dismissText"),
    });

    router.replace("/auth", {
      scroll: false,
    });
  }, [authError, authErrorMessages, router, t]);

  // Handle OAuth tokens
  // Store access/refresh tokens in HttpOnly cookies
  useEffect(() => {
    if (!accessToken || !refreshToken || handledRef.current) {
      return;
    }

    handledRef.current = true;

    setStatus("loading");

    const handleAuth = async () => {
      try {
        const response = await fetch("/api/auth/google-callback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accessToken,
            refreshToken,
          }),
        });

        if (!response.ok) {
          throw new Error("oauth_failed");
        }

        setStatus("success");

        router.replace(redirectTo || "/");
        router.refresh();
      } catch (error) {
        console.log({ error });

        setStatus("error");

        showErrorToast({
          title: t("general.toast.title.error"),
          description: t("general.toast.defaultError"),
          dismissText: t("general.toast.dismissText"),
        });

        router.replace("/auth?error=oauth_failed");
      }
    };

    handleAuth();
  }, [accessToken, refreshToken, redirectTo, router, t]);

  return <AuthCallbackView provider={provider} status={status} />;
};

export default AuthCallbackHandler;
