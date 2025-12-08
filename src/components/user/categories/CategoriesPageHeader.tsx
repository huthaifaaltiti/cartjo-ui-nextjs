import { memo } from "react";
import { useTranslations } from "next-intl";

const CategoriesPageHeader = () => {
  const t = useTranslations();

  return (
    <div className="w-full h-auto border-t pt-5">
      <h1 className="text-2xl text-text-primary-400 font-bold">
        {t("routes.categories.components.CategoriesPageHeader.header")}
      </h1>
    </div>
  );
};

export default memo(CategoriesPageHeader);
