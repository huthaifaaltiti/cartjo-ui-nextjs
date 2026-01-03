"use client";

import { memo } from "react";
import { AlertTriangle, Home, LogIn, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

type ErrorPageProps = {
  error?: Error & { digest?: string };
  title?: string;
  message?: string;
  showReLogin?: boolean;
  reset?: () => void;
};

const ErrorPage = ({
  title,
  message,
  error,
  showReLogin,
  reset,
}: ErrorPageProps) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();

  const errorTitle = title || t("errors.components.errorPage.applicationError");
  const errorMessage =
    message ||
    error?.message ||
    t("errors.components.errorPage.unexpectedErrorOccurred");
  const isAuthError =
    errorMessage.includes("fetch users statics") ||
    errorMessage.includes("unauthorized") ||
    errorMessage.includes("403") ||
    errorMessage.includes("401");

  const handleRelogin = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.clear();

    router.push(`/${locale}/auth`);
  };

  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    router.push(`/${locale}/dashboard`);
  };

  return (
    <div className="min-h-[90vh] bg-gradient-to-br flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {errorTitle}
          </h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {isAuthError
              ? t("errors.components.errorPage.couldNotLoadData")
              : errorMessage}
          </p>

          {process.env.NEXT_PUBLIC_ENV_TYPE === "development" && error && (
            <div className="mb-6 p-3 bg-gray-50 rounded-md border text-left">
              <p className="text-xs font-mono text-gray-700 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-1">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="space-y-3">
            {isAuthError && showReLogin ? (
              <button
                onClick={handleRelogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                {t("errors.components.errorPage.signInAgain")}
              </button>
            ) : (
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {t("errors.components.errorPage.tryAgain")}
              </button>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleGoHome}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                {t("errors.components.errorPage.dashboard")}
              </button>

              {!isAuthError && (
                <button
                  onClick={handleRetry}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t("errors.components.errorPage.retry")}
                </button>
              )}
            </div>

            {!isAuthError && showReLogin && (
              <button
                onClick={handleRelogin}
                className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
              >
                {t("errors.components.errorPage.signInWithDiffAccount")}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t("errors.components.errorPage.contactSupport")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ErrorPage);
