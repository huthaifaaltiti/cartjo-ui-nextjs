"use client";

import { memo, useMemo } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { isArabicLocale } from "@/config/locales.config";
import { useCategoryQuery } from "@/hooks/react-query/useCategoryQuery";
import { SubCategory } from "@/types/subCategory";
import ImageWithFallback from "@/components/shared/ImageWithFallback";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";

const CategoryProductsGrid = ({ categoryId }: { categoryId: string }) => {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = isArabicLocale(locale);

  const { data, isLoading, isFetching, isFetched, isError, error } =
    useCategoryQuery(categoryId);

  const subCategoriesList = useMemo<SubCategory[]>(() => {
    return data?.data?.subCategories ?? [];
  }, [data]);

  const showLoader =
    (!isLoading && !isFetching && !isFetched && !isError && !data?.isSuccess) ||
    isLoading ||
    isFetching;
  const showError = isFetched && isError && error?.message;
  const showNoData =
    !showLoader && !showError && subCategoriesList.length === 0;
  const showData = !showLoader && !showError && subCategoriesList.length > 0;

  const containerClass = "w-full border-t border-grey-50/20 pt-3";

  if (showLoader) {
    return (
      <div className="w-full">
        <div className="w-[40%] h-8 bg-gray-100 animate-pulse rounded" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("routes.categories.components.CategoryProductsGrid.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <NoData
          title={t("routes.categories.components.CategoryProductsGrid.noData")}
          description={t(
            "routes.categories.components.CategoryProductsGrid.checkLater"
          )}
        />
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <h1 className="sm:text-md md:text-lg lg:text-2xl text-text-primary-400 font-bold">
          {t("routes.categories.components.CategoryProductsGrid.header")}
        </h1>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {subCategoriesList.map((sc) => {
            const name = isAr ? sc?.name?.ar : sc?.name?.en;
            const image = isAr ? sc?.media?.ar?.url : sc?.media?.en?.url;

            return (
              <div
                key={sc._id}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                  <ImageWithFallback
                    src={image}
                    alt={name}
                    className="object-contain w-3/4 h-3/4 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default memo(CategoryProductsGrid);
