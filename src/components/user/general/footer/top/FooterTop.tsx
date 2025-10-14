import { memo } from "react";
import { useTranslations } from "next-intl";

const FooterTop = () => {
  const t = useTranslations();

  return (
    <div className="w-full flex justify-between gap-5 border-b border-gray-100 py-5">
      <div className="w-auto">
        <p className="text-md font-bold text-text-primary-300">
          {t("components.Footer.components.FooterTop.title")}
        </p>
        <p className="text-xs text-text-primary-100">
          {t("components.Footer.components.FooterTop.desc")}
        </p>
      </div>

      <div className="w-auto flex flex-col gap-1">
        <span className="text-xs font-bold text-text-primary-100 uppercase">
          {t("components.Footer.components.FooterTop.emailSupport")}
        </span>
        <span className="text-md font-bold text-text-primary-300">
          {t("components.Footer.components.FooterTop.email")}
        </span>
      </div>
    </div>
  );
};

export default memo(FooterTop);
