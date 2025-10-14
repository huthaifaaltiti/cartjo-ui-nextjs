import { memo } from "react";
import { useTranslations } from "next-intl";
import MaxWidthWrapper from "./shared/MaxWidthWrapper";
import LanguageSelector from "./LanguageSelector";
import HomeLink from "./HomeLink";

const TopBar: React.FC = () => {
  const t = useTranslations("components.TopBar");

  return (
    <div className="w-full py-3 border-b border-grey-50/15">
      <MaxWidthWrapper>
        <div className="w-full flex items-center justify-between">
          <div className="w-auto flex items-center gap-3">
            <HomeLink />

            <p className="text-sm text-text-primary-100">
              {t("deliver")}
              <span className="mx-1 text-text-tertiary-400 font-bold">
                <span>{t("fromTime")}</span>
                <span className="mx-1">{t("to")}</span>
                <span>{t("toTime")}</span>
              </span>
            </p>
          </div>

          <LanguageSelector />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

export default memo(TopBar);
