import { memo } from "react";
import { useTranslations } from "next-intl";

import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import LanguageSelector from "./LanguageSelector";

const TopBar: React.FC = () => {
  const t = useTranslations("components.TopBar");

  return (
    <div className="w-full py-2 border-b border-[#E5E7EB]">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between">
          <p className="text-sm text-text-primary-100">
            {t("deliver")}
            <span className="mx-1 text-text-tertiary-400 font-bold">
              <span>{t("fromTime")}</span>
              <span className="mx-1">{t("to")}</span>
              <span>{t("toTime")}</span>
            </span>
          </p>

          <LanguageSelector />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(TopBar);
