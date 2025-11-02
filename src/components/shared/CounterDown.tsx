"use client";

import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";

interface CounterDownProps {
  startCounting: boolean;
  countDownAmount?: number;
  withRelocation?: boolean;
  withDirMessage?: boolean;
  relocationPath?: string;
  dirMessage?: string;
  size?: "sm" | "md" | "lg";
  color?: "purple" | "blue" | "green" | "red" | "gray";
  align?: "center" | "left" | "right";
  className?: string;
}

const CounterDown = ({
  startCounting,
  countDownAmount = 10,
  withRelocation,
  relocationPath,
  size = "md",
  color = "purple",
  align = "center",
  className = "",
  withDirMessage,
  dirMessage
}: CounterDownProps) => {
  const t = useTranslations("components.CounterDown");
  const [countdown, setCountdown] = useState<number>(countDownAmount);

  useEffect(() => {
    if (!startCounting) return;

    setCountdown(countDownAmount);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          if (withRelocation && relocationPath) {
            window.location.href = relocationPath;
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [startCounting, countDownAmount, withRelocation, relocationPath]);

  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  }[size];

  const messageSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-md",
  }[size];

  const colorClasses = {
    purple: "text-purple-600",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    gray: "text-gray-600",
  }[color];

  const alignClasses = {
    center: "justify-center",
    left: "justify-start",
    right: "justify-end",
  }[align];

  return (
    <div
      className={`w-full flex items-center ${alignClasses} gap-2 ${className}`}
    >
      {withDirMessage && (
        <p className={`${messageSizeClasses} text-gray-600 mb-2`}>{dirMessage || t("redirectingToLogin")}</p>
      )}
      <div className="w-auto flex items-center gap-3">
        <span className={`${sizeClasses} font-bold ${colorClasses}`}>
          {countdown}
        </span>
        <span className="text-gray-500 text-sm">
          {t(`${countdown === 1 ? "second" : "seconds"}`)}
        </span>
      </div>
    </div>
  );
};

export default memo(CounterDown);
