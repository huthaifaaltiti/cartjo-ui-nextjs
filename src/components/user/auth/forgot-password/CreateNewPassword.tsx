"use client";

import { Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { memo, useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useGeneralContext } from "@/contexts/General.context";
import PasswordRules from "../../PasswordRules";
import CounterDown from "@/components/shared/CounterDown";
import { useTranslations } from "next-intl";
import {
  setConfirmPassword,
  setErrors,
  setNewPassword,
  setStep,
} from "@/redux/slices/authorization/forgotPassword";
import { resetPassword } from "@/redux/slices/authorization/forgotPassword/actions";

const CreateNewPassword = () => {
  const t = useTranslations(
    "routes.auth.routes.forgotPassword.components.CreateNewPassword"
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    newPassword,
    confirmPassword,
    errors,
    isLoading,
    identifier,
    verificationCode,
    isNewPasswordSet,
  } = useSelector((state: RootState) => state.forgotPassword);
  const { locale } = useGeneralContext();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const handleNewPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setNewPassword(e.target.value));
    },
    [dispatch]
  );

  const handleConfirmPasswordChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setConfirmPassword(e.target.value));
    },
    [dispatch]
  );

  const handleBack = () => {
    dispatch(setStep(1));
  };

  const handleReset = async () => {
    const newErrors: Record<string, string> = {};
    if (!isPasswordValid) newErrors.password = t("passwordNotMeetRules");
    if (newPassword !== confirmPassword)
      newErrors.confirmPassword = t("passwordsDoNotMatch");

    if (Object.keys(newErrors).length) {
      dispatch(setErrors(newErrors));
      return;
    }

    await dispatch(
      resetPassword({
        identifier,
        code: verificationCode,
        newPassword,
        lang: locale,
      })
    );
  };

  useEffect(() => {
    setShowRules(newPassword.length > 0);
  }, [newPassword]);

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold">{t("title")}</h2>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      <div className="space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("newPasswordLabel")}
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder={t("newPasswordPlaceholder")}
              className={`w-full px-4 py-3 border ${
                errors.password || errors.resetPasswordErr
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showNewPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}

          {showRules && (
            <PasswordRules
              password={newPassword}
              onValidChange={setIsPasswordValid}
            />
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("confirmPasswordLabel")}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder={t("confirmPasswordPlaceholder")}
              className={`w-full px-4 py-3 border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {newPassword &&
          confirmPassword &&
          newPassword === confirmPassword &&
          isPasswordValid && (
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{t("passwordsMatch")}</span>
            </div>
          )}

        {errors.resetPasswordErr && (
          <p className="mt-1 text-sm text-red-600">{errors.resetPasswordErr}</p>
        )}

        {/* Buttons */}
        {!isNewPasswordSet && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleBack}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              {t("backButton")}
            </button>
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white-50 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white-50 border-t-transparent rounded-full animate-spin" />
              ) : (
                t("resetButton")
              )}
            </button>
          </div>
        )}

        {isNewPasswordSet && (
          <div className="w-full flex items-center justify-center gap-2">
            <p className="text-sm text-text-primary-400">
              {t("redirectingMessage")}
            </p>
            <CounterDown
              startCounting={isNewPasswordSet}
              countDownAmount={5}
              withRelocation={true}
              relocationPath={`/auth?identifier=${encodeURIComponent(
                identifier
              )}`}
              size="sm"
              color="purple"
              align="center"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CreateNewPassword);
