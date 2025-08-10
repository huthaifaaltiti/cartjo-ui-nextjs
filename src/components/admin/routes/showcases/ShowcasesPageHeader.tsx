import { useTranslations } from "next-intl";
import { memo } from "react";

const ShowcasesPageHeader = () => {
  const t = useTranslations();

  return (
    <div className="mb-3 pb-3 px-2 md:px-0 border-b">
      <h1 className="text-xl font-bold text-gray-900">
        {t("routes.dashboard.routes.showcases.title")}
      </h1>
      <p className="text-gray-600 text-sm">
        {t("routes.dashboard.routes.showcases.desc")}
      </p>
    </div>
  );
};

export default memo(ShowcasesPageHeader);
