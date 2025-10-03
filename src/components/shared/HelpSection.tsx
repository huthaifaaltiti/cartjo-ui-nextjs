"use client";

import { useTranslations } from "next-intl";
import { memo } from "react";

interface HelpSectionProps {
  title?: string;
  description?: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const HelpSection = ({
  title,
  description,
  primaryAction = {
    label: "Contact Support",
    onClick: () => console.log("Contact Support clicked"),
  },
  secondaryAction = {
    label: "Browse Categories",
    onClick: () => console.log("Browse Categories clicked"),
  },
}: HelpSectionProps) => {
  const t = useTranslations();

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center border border-blue-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title || t("components.HelpSection.title")}
      </h3>
      <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
        {description || t("components.HelpSection.subTitle")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="bg-primary-600 text-white-50 px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="bg-white-50 text-primary-600 px-6 py-3 rounded-lg font-semibold border-2 border-primary-200 hover:border-primary-200 hover:bg-white-500 transition-colors"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default memo(HelpSection);
