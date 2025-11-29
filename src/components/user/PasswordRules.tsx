"use client";

import { RootState } from "@/redux/store";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface PasswordRulesProps {
  password: string;
  onValidChange?: (isValid: boolean) => void;
}

const PasswordRules: React.FC<PasswordRulesProps> = ({
  password,
  onValidChange,
}) => {
  const { dir } = useSelector((state: RootState) => state.general);
  const t = useTranslations(
    "routes.auth.components.AuthTabs.components.PasswordRules.rules"
  );

  const rules = [
    { label: t("charsCount"), test: (pw: string) => pw.length >= 8 },
    {
      label: t("uppercase"),
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: t("lowercase"),
      test: (pw: string) => /[a-z]/.test(pw),
    },
    { label: t("number"), test: (pw: string) => /\d/.test(pw) },
    {
      label: t("special"),
      test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
    },
  ];

  const isPasswordValid = rules.every((rule) => rule.test(password));

  useEffect(() => {
    if (onValidChange && password) {
      onValidChange(isPasswordValid);
    }
  }, [isPasswordValid, onValidChange, password]);

  return (
    <ul dir={dir} className="mt-2 text-xs text-gray-500 space-y-1">
      {rules.map((rule) => {
        const passed = rule.test(password);
        return (
          <li
            key={rule.label}
            className={`flex items-center gap-1 ${
              passed ? "text-green-600" : ""
            }`}
          >
            {passed && <CheckCircle2 className="w-3 h-3" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordRules;
