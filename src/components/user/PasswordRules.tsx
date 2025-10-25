"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface PasswordRulesProps {
  password: string;
  onValidChange?: (isValid: boolean) => void;
}

const rules = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  {
    label: "At least 1 uppercase letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "At least 1 lowercase letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  { label: "At least 1 number", test: (pw: string) => /\d/.test(pw) },
  {
    label: "At least 1 special character",
    test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw),
  },
];

const PasswordRules: React.FC<PasswordRulesProps> = ({
  password,
  onValidChange,
}) => {
  const isPasswordValid = rules.every((rule) => rule.test(password));

  useEffect(() => {
    if (onValidChange && password) {
      onValidChange(isPasswordValid);
    }
  }, [isPasswordValid, onValidChange, password]);

  return (
    <ul className="mt-2 text-xs text-gray-500 space-y-1">
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
