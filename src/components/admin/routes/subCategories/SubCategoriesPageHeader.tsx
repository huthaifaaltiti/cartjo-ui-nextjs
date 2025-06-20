import { useTranslations } from "next-intl";
import { memo } from "react";

const SubCategoriesPageHeader = () => {
  const t = useTranslations();

  return (
    <div className="mb-3 pb-3 border-b">
      <h1 className="text-xl font-bold text-gray-900">
        {t("routes.dashboard.routes.subCategories.title")}
      </h1>
      <p className="text-gray-600 text-sm">
        {t("routes.dashboard.routes.subCategories.desc")}
      </p>
    </div>
  );
};

export default memo(SubCategoriesPageHeader);
