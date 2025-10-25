"use client";

import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";

interface CounterDownProps {
  startCounting: boolean;
  countDownAmount?: number;
  withRelocation?: boolean;
  relocationPath?: string;
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
}: CounterDownProps) => {
  const t = useTranslations();
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
    <div className={`flex items-center ${alignClasses} gap-2 ${className}`}>
      <span className={`${sizeClasses} font-bold ${colorClasses}`}>
        {countdown}
      </span>
      <span className="text-gray-500 text-xs">
        {t(`components.CounterDown.${countdown !== 1 ? "seconds" : "second"}`)}
      </span>
    </div>
  );
};

export default memo(CounterDown);
