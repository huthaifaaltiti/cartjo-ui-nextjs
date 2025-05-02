import { memo } from "react";
import { useTranslations } from "next-intl";

import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import LanguageSelector from "./LanguageSelector";

const TopBar: React.FC = () => {
  const t = useTranslations("components.TopBar");

  return (
    <MaxWidthWrapper>
      {/* Delivering statement */}
      <div className="w-full py-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-text-primary-100 flex items-center gap-1">
            {t("deliver")}
            <span className="flex items-center gap-1 text-text-tertiary-400 font-bold">
              <span>{t("fromTime")}</span>
              <span>{t("to")}</span>
              <span>{t("toTime")}</span>
            </span>
          </p>
        </div>
        {/* control */}
        <div>
          <LanguageSelector />
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default memo(TopBar);
