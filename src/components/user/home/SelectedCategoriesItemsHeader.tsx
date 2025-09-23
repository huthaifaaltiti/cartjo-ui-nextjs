import { memo } from "react";
import { useTranslations } from "next-intl";

const SelectedCategoriesItemsHeader = () => {
  const t = useTranslations();

  return (
    <section className="w-full mb-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl md:text-3xl font-bold text-text-primary-300">
          {t("routes.home.components.SelectedCategoriesItemsHeader.title")}
        </h2>
        <p className="text-sm md:text-base text-text-primary-200 opacity-80">
          {t("routes.home.components.SelectedCategoriesItemsHeader.subtitle")}
        </p>
      </div>
    </section>
  );
};

export default memo(SelectedCategoriesItemsHeader);