"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { Locale } from "@/types/locale";
import { useVerifyEmail } from "@/contexts/VerifyEmailContext";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export default function VerifyEmailContent({ locale }: { locale: Locale | string }) {
  const t = useTranslations('routes.verifyEmail.components.VerifyEmailContent');
  const router = useRouter()

  const { verify } = useVerifyEmail();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(10);

  const [token] = useQueryState("token", {
    defaultValue: "",
    parse: (value) => String(value),
    serialize: (value) => String(value),
  });

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage(t("noToken"));
        return;
      }

      try {
        const response = await verify(token, locale);

        if (response.isSuccess) {
          setStatus("success");
          setMessage(response?.message || t("successMessageDefault"));

          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                window.location.href = "/auth";
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(timer);
        } else {
          setStatus("error");
          setMessage(response.message || t("errorMessageDefault"));
        }
      } catch (error) {
        setStatus("error");
        setMessage(t("errorOccurred"));
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [token, locale, verify, t]);

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-purple-50 via-white-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white-50 px-8 py-4 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CartJO
            </h1>
            <p className="text-xs text-gray-500 mt-1">{t("logoSubtitle")}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          {status === "loading" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{t("verifyingEmail")}</h2>
              <p className="text-gray-600 mb-6">{t("verifyingEmailDesc")}</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{t("emailVerifiedTitle")}</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-medium text-gray-700">{t("emailVerifiedDesc")}</p>
                </div>
                <p className="text-xs text-gray-600">{t("emailVerifiedExtra")}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">{t("redirectingToLogin")}</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-purple-600">{countdown}</span>
                  <span className="text-gray-500">{t("seconds")}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/auth')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white-50 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t("continueToLogin")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{t("verificationFailedTitle")}</h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 font-medium mb-2">{t("commonReasons")}</p>
                <ul className="text-xs text-red-700 text-left space-y-1">
                  <li>{t("linkExpired")}</li>
                  <li>{t("linkUsed")}</li>
                  <li>{t("invalidLink")}</li>
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => (window.location.href = "/resend-verification")}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white-50 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  {t("requestNewLink")}
                </button>
                <button
                 onClick={() => router.push('/support')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  {t("contactSupport")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
