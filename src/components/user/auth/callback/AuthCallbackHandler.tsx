"use client";

import { useEffect, useRef, useState } from "react";
import { signIn } from "next-auth/react";
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

  const [authToken] = useQueryState("authToken", { defaultValue: "" });
  const [authError] = useQueryState("authError", { defaultValue: "" });
  const [provider] = useQueryState("provider", { defaultValue: "" });
  const [redirectTo] = useQueryState("redirectTo", { defaultValue: "" });

  const authErrorMessages: Record<string, string> = {
    GOOGLE_NO_CODE: t(
      "routes.auth.components.AuthTabs.components.login.errors.google.noCode",
    ),
    GOOGLE_EMAIL_MISSING: t(
      "routes.auth.components.AuthTabs.components.login.errors.google.emailMissing",
    ),
    GOOGLE_AUTH_FAILED: t(
      "routes.auth.components.AuthTabs.components.login.errors.google.failed",
    ),
  };

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

    router.replace("/auth", { scroll: false });
  }, [authError, router, t]);

  // Handle token sign-in
  useEffect(() => {
    if (!authToken || handledRef.current) return;

    handledRef.current = true;
    setStatus("loading");

    signIn("credentials", {
      token: authToken,
      redirect: false,
    })
      .then((res) => {
        if (!res?.ok) throw new Error("oauth_failed");

        setStatus("success");

        router.replace(redirectTo || "/");
      })
      .catch(() => {
        setStatus("error");
        router.replace("/auth?error=oauth_failed");
      });
  }, [authToken, redirectTo, router, t]);

  return <AuthCallbackView provider={provider} status={status} />;
};

export default AuthCallbackHandler;
