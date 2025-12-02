import { memo } from "react";
import { useTranslations } from "next-intl";

const FooterTop = () => {
  const t = useTranslations();

  return (
    <div className="w-full flex flex-col lg:flex-row justify-between gap-5 border-b border-gray-100 py-5 px-4 sm:px-6 lg:px-8">
      {/* Left section */}
      <div className="w-full lg:w-auto">
        <p className="text-sm sm:text-md lg:text-lg font-bold text-text-primary-300">
          {t("components.Footer.components.FooterTop.title")}
        </p>
        <p className="text-xs sm:text-sm lg:text-md text-text-primary-100">
          {t("components.Footer.components.FooterTop.desc")}
        </p>
      </div>

      {/* Right section */}
      <div className="w-full lg:w-auto flex flex-col gap-1 mt-4 lg:mt-0">
        <span className="text-xs sm:text-sm lg:text-md font-bold text-text-primary-100 uppercase">
          {t("components.Footer.components.FooterTop.emailSupport")}
        </span>
        <span className="text-sm sm:text-md lg:text-lg font-bold text-text-primary-300">
          {t("components.Footer.components.FooterTop.email")}
        </span>
      </div>
    </div>
  );
};

export default memo(FooterTop);
