"use client";

import React, { useEffect } from "react";
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { useQueryState } from "nuqs";
import { Locale } from "@/types/locale";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import RequestNewLinkBtn from "./RequestNewLinkBtn";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { verifyEmail } from "@/redux/slices/authorization/verifyEmail/actions";
import {
  resetVerifyEmailState,
  setVerifyEmailStatus,
} from "@/redux/slices/authorization/verifyEmail";
import { useGeneralContext } from "@/contexts/General.context";
import CounterDown from "@/components/shared/CounterDown";

export default function VerifyEmailContent({
  locale,
}: {
  locale: Locale | string;
}) {
  const t = useTranslations("");
  const router = useRouter();
  const { isArabic } = useGeneralContext()
  const dispatch = useDispatch<AppDispatch>();

  const { status, message, isSuccess } = useSelector(
    (state: RootState) => state.verifyEmail.verify
  );

  const [token] = useQueryState("token", {
    defaultValue: "",
    parse: (value) => String(value),
    serialize: (value) => String(value),
  });

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        dispatch(
          setVerifyEmailStatus({
            key: "verify",
            status: "error",
            message: t(
              "routes.verifyEmail.components.VerifyEmailContent.noToken"
            ),
            isSuccess: false,
          })
        );
        return;
      }

      await dispatch(verifyEmail({ token, lang: locale }));
    };

    verify();

    return () => {
      dispatch(resetVerifyEmailState());
    };
  }, [token, locale, dispatch, t]);

  return (
    <div className="min-h-screen h-full bg-gradient-to-br from-purple-50 via-white-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white-50 px-8 py-4 rounded-2xl shadow-lg">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t("general.others.logoTitle")}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {t(
                "routes.verifyEmail.components.VerifyEmailContent.logoSubtitle"
              )}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white-50 rounded-2xl shadow-xl p-8 border border-gray-100">
          {(status === "loading" || status === "idle") && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t(
                  "routes.verifyEmail.components.VerifyEmailContent.verifyingEmail"
                )}
              </h2>
              <p className="text-gray-600 mb-6">
                {t(
                  "routes.verifyEmail.components.VerifyEmailContent.verifyingEmailDesc"
                )}
              </p>
              <div className="flex items-center justify-center gap-2">
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t(
                  "routes.verifyEmail.components.VerifyEmailContent.emailVerifiedTitle"
                )}
              </h2>
              <p className="text-gray-600 mb-6">{message}</p>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <p className="text-sm font-medium text-gray-700">
                    {t(
                      "routes.verifyEmail.components.VerifyEmailContent.emailVerifiedDesc"
                    )}
                  </p>
                </div>
                <p className="text-xs text-gray-600">
                  {t(
                    "routes.verifyEmail.components.VerifyEmailContent.emailVerifiedExtra"
                  )}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  {t(
                    "routes.verifyEmail.components.VerifyEmailContent.redirectingToLogin"
                  )}
                </p>

                <CounterDown
                  startCounting={isSuccess}
                  countDownAmount={10}
                  withRelocation={true}
                  relocationPath="/auth"
                  size="lg"
                  color="purple"
                  align="center"
                />
              </div>

              <button
                onClick={() => router.push("/auth")}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white-50 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {t(
                  "routes.verifyEmail.components.VerifyEmailContent.continueToLogin"
                )}
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {t(
                  "routes.verifyEmail.components.VerifyEmailContent.verificationFailedTitle"
                )}
              </h2>

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-red-800 font-medium mb-2">
                  {t(
                    "routes.verifyEmail.components.VerifyEmailContent.commonReasons"
                  )}
                </p>
                <ul
                  className={`text-xs text-red-700 ${
                    isArabic ? "text-right" : "text-left"
                  }  space-y-1`}
                >
                  <li>
                    {t(
                      "routes.verifyEmail.components.VerifyEmailContent.linkExpired"
                    )}
                  </li>
                  <li>
                    {t(
                      "routes.verifyEmail.components.VerifyEmailContent.linkUsed"
                    )}
                  </li>
                  <li>
                    {t(
                      "routes.verifyEmail.components.VerifyEmailContent.invalidLink"
                    )}
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <RequestNewLinkBtn />
                <Button
                  onClick={() => router.push("/support")}
                  className="w-full h-12 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                >
                  {t(
                    "routes.verifyEmail.components.VerifyEmailContent.contactSupport"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
