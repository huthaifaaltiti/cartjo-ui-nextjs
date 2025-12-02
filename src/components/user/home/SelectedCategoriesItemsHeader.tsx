import { memo } from "react";
import { useTranslations } from "next-intl";

const SelectedCategoriesItemsHeader = () => {
  const t = useTranslations();

  return (
    <section className="w-full mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary-300">
          {t("routes.home.components.SelectedCategoriesItemsHeader.title")}
        </h2>
        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-text-primary-200 opacity-80">
          {t("routes.home.components.SelectedCategoriesItemsHeader.subtitle")}
        </p>
      </div>
    </section>
  );
};

export default memo(SelectedCategoriesItemsHeader);
