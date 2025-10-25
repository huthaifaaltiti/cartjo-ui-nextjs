"use client";

import { KeyRound, Mail, Phone, User } from "lucide-react";
import { memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setErrors, setIdentifier } from "@/redux/slices/auth/forgotPassword";
import { sendIdentifier } from "@/redux/slices/auth/forgotPassword/actions";
import { useTranslations } from "next-intl";

const IdentifyAccount = () => {
  const t = useTranslations(
    "routes.auth.routes.forgotPassword.components.IdentifyAccount"
  );
  const dispatch = useDispatch<AppDispatch>();
  const {
    identifier,
    identifierType,
    errors: { sendIdentifier: sendIdentifierErr, identifier: identifierErr },
    isLoading,
  } = useSelector((state: RootState) => state.forgotPassword);

  const handleIdentifierChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setIdentifier(e.target.value));
    },
    [dispatch]
  );

  const handleNext = useCallback(async () => {
    if (!identifier.trim()) {
      dispatch(
        setErrors({
          identifier: t("noIdentifier"),
        })
      );
      return;
    }

    dispatch(setErrors({}));

    await dispatch(sendIdentifier({ identifier }));
  }, [identifier, dispatch]);

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <KeyRound className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t("header")}</h2>
        <p className="text-gray-600 text-sm">{t("desc")}</p>
      </div>

      {/* Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("input.label")}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {identifierType === "email" && (
                <Mail className="h-5 w-5 text-gray-400" />
              )}
              {identifierType === "phone" && (
                <Phone className="h-5 w-5 text-gray-400" />
              )}
              {identifierType === "username" && (
                <User className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={identifier}
              onChange={handleIdentifierChange}
              placeholder={t("input.placeholder")}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                identifierErr || sendIdentifierErr
                  ? "border-red-500"
                  : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-gray-900`}
            />
          </div>
          {identifierErr && (
            <p className="mt-1 text-sm text-red-600">{identifierErr}</p>
          )}
          {sendIdentifierErr && (
            <p className="mt-1 text-sm text-red-600">{sendIdentifierErr}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white-50"
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white-50 border-t-transparent rounded-full animate-spin" />
          ) : (
            t("submit")
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(IdentifyAccount);
