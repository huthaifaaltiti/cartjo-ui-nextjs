"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useGeneralContext } from "@/contexts/General.context";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExtendedSession } from "@/types/session";
import { useVerifyEmail } from "@/contexts/VerifyEmailContext";
import { useTranslations } from "next-intl";

export default function EmailVerificationContent() {
  const t = useTranslations("routes.emailVerification.components.EmailVerificationContent");
  const { locale } = useGeneralContext();
  const { data: sessionData } = useSession();
  const router = useRouter();
  
  const isLoggedIn = !!sessionData;
  const sessionEmail = (sessionData as ExtendedSession)?.user?.email;
  const { reVerify } = useVerifyEmail();

  const [status, setStatus] = useState<"loading" | "success" | "error" | "expired" | "manual">("loading");
  const [message, setMessage] = useState("");
  const [countdown] = useState(10);
  const [email, setEmail] = useState(sessionEmail || "");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const initiateVerification = async () => {
      // If user is logged in, show resend interface
      if (isLoggedIn) {
        setStatus("expired");
        setMessage(t("needsVerification"));
        return;
      }

      // If not logged in, show manual entry
      setStatus("manual");
      setMessage(t("enterEmailPrompt"));
    };

    initiateVerification();
  }, [isLoggedIn, t]);

  const handleResendVerification = async () => {
    if (!email) {
      setMessage(t("emailRequired"));
      return;
    }

    setIsResending(true);
    setResendSuccess(false);

    try {
      const response = await reVerify(email, locale);

      if (response?.isSuccess) {
        setResendSuccess(true);
        setMessage(response?.message || t("verificationSent", { email }));
        
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setMessage(response?.message || t("resendFailed"));
      }
    } catch (error) {
      setMessage(t("resendError"));
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white px-8 py-4 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CartJO
            </h1>
            <p className="text-xs text-gray-500 mt-1">{t("logoSubtitle")}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          
          {/* Loading State */}
          {status === "loading" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t("loadingTitle")}
              </h2>
              <p className="text-gray-600 mb-6">{t("loadingDesc")}</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t("successTitle")}
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-medium text-gray-700">
                    {t("successDesc")}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {t("successExtra")}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  {t("redirectingToLogin")}
                </p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-purple-600">
                    {countdown}
                  </span>
                  <span className="text-gray-500">{t("seconds")}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/auth")}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t("continueToLogin")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t("errorTitle")}
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 font-medium mb-2">
                  {t("commonReasons")}
                </p>
                <ul className="text-xs text-red-700 text-left space-y-1">
                  <li>• {t("reasonExpired")}</li>
                  <li>• {t("reasonUsed")}</li>
                  <li>• {t("reasonInvalid")}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setStatus(isLoggedIn ? "expired" : "manual")}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  {t("requestNewLink")}
                </button>
                <button
                  onClick={() => router.push("/support")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  {t("contactSupport")}
                </button>
              </div>
            </div>
          )}

          {/* Expired/Resend State (Logged In) */}
          {status === "expired" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t("expiredTitle")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("expiredDesc")}
              </p>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="w-5 h-5 text-amber-600" />
                  <p className="text-sm font-medium text-gray-700">
                    {t("resendEmailLabel")}
                  </p>
                </div>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all mb-4"
                  disabled={isLoggedIn && !!sessionEmail}
                />

                <button
                  onClick={handleResendVerification}
                  disabled={isResending || !email}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      {t("sendVerificationEmail")}
                    </>
                  )}
                </button>
              </div>

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-800 font-medium">
                    {t("resendSuccessMessage")}
                  </p>
                </div>
              )}

              {message && !resendSuccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">{message}</p>
                </div>
              )}

              {!isLoggedIn && (
                <button
                  onClick={() => router.push("/auth")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  {t("backToLogin")}
                </button>
              )}
            </div>
          )}

          {/* Manual Entry State (Not Logged In) */}
          {status === "manual" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Mail className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t("manualTitle")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("manualDesc")}
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all mb-4"
                />

                <button
                  onClick={handleResendVerification}
                  disabled={isResending || !email}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5" />
                      {t("sendVerificationLink")}
                    </>
                  )}
                </button>
              </div>

              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-800 font-medium">
                    {t("manualSuccessMessage")}
                  </p>
                </div>
              )}

              {message && !resendSuccess && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-800">{message}</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/auth?redirectTo=/email-verification&resend=true")}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  {t("alreadyHaveAccount")}
                </button>
                <button
                  onClick={() => router.push("/support")}
                  className="w-full text-gray-600 py-3 rounded-xl font-medium hover:text-gray-800 transition-colors duration-200"
                >
                  {t("needHelp")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>{t("footerNote")}</p>
        </div>
      </div>
    </div>
  );
}