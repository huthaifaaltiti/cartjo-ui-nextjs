"use client";

import { useGeneralContext } from "@/contexts/General.context";
import {
  resetVerificationCodeMessage,
  setErrors,
  setStep,
  setVerificationCode,
} from "@/redux/slices/authorization/forgotPassword";
import {
  sendIdentifier,
  verifyResetPasswordCode,
} from "@/redux/slices/authorization/forgotPassword/actions";
import { AppDispatch, RootState } from "@/redux/store";
import { CheckCircle2, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

const VerifyCode = () => {
  const t = useTranslations(
    "routes.auth.routes.forgotPassword.components.VerifyCode"
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    identifier,
    errors,
    isLoading,
    verificationCode,
    currentStep,
    verificationCodeSuccessMessage,
  } = useSelector((state: RootState) => state.forgotPassword);
  const { locale } = useGeneralContext();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    dispatch(setVerificationCode(value));
  };

  const handleNext = async () => {
    dispatch(resetVerificationCodeMessage());

    if (!verificationCode.trim() || verificationCode.length !== 6) {
      dispatch(
        setErrors({
          verificationCode: t("noCode"),
        })
      );

      return;
    }

    dispatch(setErrors({}));

    await dispatch(
      verifyResetPasswordCode({
        identifier,
        code: verificationCode,
        lang: locale,
      })
    );
  };

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch(setStep(currentStep - 1));
    }
  };

  const handleResendVerifyCode = async () => {
    await dispatch(sendIdentifier({ identifier }));
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-gray-600">{t("description", { identifier })}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("inputLabel")}
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={handleCodeChange}
            placeholder={t("placeholder")}
            maxLength={6}
            className={`w-full px-4 py-3 border ${
              errors.verificationCode ? "border-red-500" : "border-gray-300"
            } rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
          />
          {errors.verificationCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.verificationCode}
            </p>
          )}
        </div>

        <div onClick={handleResendVerifyCode}>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            {t("resend")}
          </button>
        </div>

        {verificationCodeSuccessMessage && (
          <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {verificationCodeSuccessMessage}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            {t("back")}
          </button>
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 bg-blue-600 text-white-50 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white-50 border-t-transparent rounded-full animate-spin" />
            ) : (
              t("verifyCode")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(VerifyCode);
