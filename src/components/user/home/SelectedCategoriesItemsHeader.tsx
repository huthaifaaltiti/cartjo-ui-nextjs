import { memo } from "react";
import { useTranslations } from "next-intl";

const SelectedCategoriesItemsHeader = () => {
  const t = useTranslations();

  return (
    <div className="w-full h-auto">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div>
            <h3 className="text-xl text-text-primary-300 font-bold">
              {t("routes.home.components.SelectedCategoriesItemsHeader.header")}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(SelectedCategoriesItemsHeader);
