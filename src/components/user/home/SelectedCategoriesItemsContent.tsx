"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { getCategoriesPicksQueryOptions } from "@/utils/queryOptions";
import { useQueries } from "@tanstack/react-query";
import { Category } from "@/types/category.type";
import { useAuthContext } from "@/hooks/useAuthContext";
import ShowcaseProductVertCard from "./ShowcaseProductVertCard";
import LoadingDotsFlexible from "@/components/shared/loaders/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import { useGeneralContext } from "@/contexts/General.context";
import SelectedCategoriesItemsContentHeader from "./SelectedCategoriesItemsContentHeader";

const SelectedCategoriesItemsContent = ({
  randomCategories,
}: {
  randomCategories: Category[];
}) => {
  const t = useTranslations();

  const { accessToken, locale } = useAuthContext();
  const { isArabic } = useGeneralContext();

  const results = useQueries({
    queries: randomCategories.map((category) =>
      getCategoriesPicksQueryOptions(category._id, locale, accessToken ?? "")
    ),
  });

  const containerClass =
    "w-full h-full min-h-44 flex items-center justify-center";

  return (
    <div className="w-full h-auto space-y-6">
      {randomCategories.map((category, idx) => {
        const { data, isLoading, isFetching, isError, error } = results[idx];

        const showLoader =
          (!isLoading && !isFetching && !isError && !data?.isSuccess) ||
          isLoading ||
          isFetching;
        const showError = isError;
        const showNoData =
          !showLoader && !showError && data?.data?.length === 0;
        const hasNoData = !showLoader && !showError && data?.data?.length === 0;
        const showData =
          !showLoader &&
          !showError &&
          Array.isArray(data?.data) &&
          data.data.length > 0;

        if (hasNoData) return null;

        return (
          <div key={category._id} className="pb-4">
            <SelectedCategoriesItemsContentHeader
              category={category}
              isArabic={isArabic}
              locale={locale}
              ctaText={t(
                "routes.home.components.SelectedCategoriesItemsContentHeader.ctaBtnText",
                {
                  categoryName: isArabic
                    ? category?.name?.ar
                    : category?.name?.en,
                }
              )}
            />

            {showLoader && (
              <div className={containerClass}>
                <LoadingDotsFlexible size="1.5rem" color="#634C9F" count={3} />
              </div>
            )}

            {showError && (
              <div className={containerClass}>
                <ErrorMessage
                  message={
                    error?.message ||
                    t(
                      "routes.home.components.SelectedCategoriesItemsContent.err"
                    )
                  }
                />
              </div>
            )}

            {showNoData && (
              <div className={containerClass}>
                <NoData
                  title={t(
                    "routes.home.components.SelectedCategoriesItemsContent.noDataHeader"
                  )}
                  description={t(
                    "routes.home.components.SelectedCategoriesItemsContent.noDataMsg"
                  )}
                />
              </div>
            )}

            {showData && (
              <ul className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data?.data?.map((p) => (
                  <li key={p._id}>
                    <ShowcaseProductVertCard item={p} isArabic={isArabic} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default memo(SelectedCategoriesItemsContent);
