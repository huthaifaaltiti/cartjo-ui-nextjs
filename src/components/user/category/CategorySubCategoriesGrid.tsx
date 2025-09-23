"use client";

import { memo, useMemo } from "react";
import { useLocale } from "next-intl";
import { useTranslations } from "use-intl";
import { isArabicLocale } from "@/config/locales.config";
import { useCategoryQuery } from "@/hooks/react-query/useCategoryQuery";
import { SubCategory } from "@/types/subCategory";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import SubCategoryCard from "./SubCategoryCard";

const CategorySubCategoriesGrid = ({ categoryId }: { categoryId: string }) => {
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
            t("routes.categories.components.CategorySubCategoriesGrid.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <NoData
          title={t(
            "routes.categories.components.CategorySubCategoriesGrid.noData"
          )}
          description={t(
            "routes.categories.components.CategorySubCategoriesGrid.checkLater"
          )}
        />
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <h1 className="sm:text-md md:text-lg lg:text-2xl text-text-primary-400 font-bold">
          {t("routes.categories.components.CategorySubCategoriesGrid.header")}
        </h1>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {subCategoriesList.map((sc) => {
            const name = isAr ? sc?.name?.ar : sc?.name?.en;
            const image = isAr ? sc?.media?.ar?.url : sc?.media?.en?.url;

            return (
              <SubCategoryCard
                key={sc._id}
                id={sc._id}
                name={name}
                image={image}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default memo(CategorySubCategoriesGrid);
