"use client";

import React, { memo, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { isArabicLocale } from "@/config/locales.config";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { useActiveShowcasesQuery } from "@/hooks/react-query/useShowcasesQuery";
import ShowcaseSection from "./ShowcaseSection";
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import LoadingDotsFlexible from "@/components/shared/loaders/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import ShowcaseProductRowCard from "./ShowcaseProductVertCard";
import ShowcaseProduct212 from "./ShowcaseProduct212";
import ShowcaseProduct121 from "./ShowcaseProduct121";

const HomeShowcaseContent = () => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const t = useTranslations();
  const { data, isLoading, isFetching, isError, error } =
    useActiveShowcasesQuery(PAGINATION_LIMITS.ACTIVE_ITEMS_IN_HOME_SHOWCASE);

  const activeShowcasesList = useMemo(
    () =>
      data?.data?.sort(
        (a, b) => (a.priority ?? Infinity) - (b.priority ?? Infinity)
      ) ?? [],
    [data]
  );

  // Generate one random layout type per showcase
  const showcaseLayouts = useMemo(() => {
    const showcaseItemsViewType = ["row", "212", "121"];

    return activeShowcasesList.map(() => {
      const randNum = Math.floor(Math.random() * showcaseItemsViewType.length);
      return showcaseItemsViewType[randNum];
    });
  }, [activeShowcasesList]);

  const showLoader =
    (!isLoading && !isFetching && !isError && !data?.isSuccess) ||
    isLoading ||
    isFetching;
  const showError = isError;
  const showNoData =
    !showLoader && !showError && activeShowcasesList.length === 0;
  const showData = !showLoader && !showError && activeShowcasesList.length > 0;

  const containerClass = "w-full h-full flex items-center justify-center";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <LoadingDotsFlexible size="1.5rem" color="#634C9F" count={3} />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("components.CategoriesCarouselClient.failedLoad")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <NoData
          title={t("components.CategoriesCarouselClient.noData")}
          description={t("components.CategoriesCarouselClient.checkLater")}
        />
      </div>
    );
  }

  if (showData) {
    return (
      <div className="w-full min-h-screen h-full bg-gradient-to-b from-gray-100 to-white-50">
        <MaxWidthWrapper className="w-full max-w-max py-10 flex flex-col gap-8">
          {activeShowcasesList?.map((actSho, i) => {
            const layoutType = showcaseLayouts[i];

            return (
              <ShowcaseSection
                key={actSho?._id + i}
                header={isArabic ? actSho?.title?.ar : actSho?.title?.en}
                desc={
                  isArabic ? actSho?.description?.ar : actSho?.description?.en
                }
                btnText={
                  isArabic
                    ? actSho?.showAllButtonText?.ar
                    : actSho?.showAllButtonText?.en
                }
                uri={actSho?.showAllButtonLink}
              >
                <div className="w-full">
                  {layoutType === "row" && (
                    <div className="w-full flex justify-between gap-4">
                      {actSho?.items?.slice(0, 4).map((item, itemIndex) => (
                        <ShowcaseProductRowCard
                          key={`Showcase-product_${i}_${itemIndex}`}
                          item={item}
                          isArabic={isArabic}
                        />
                      ))}
                    </div>
                  )}

                  {layoutType === "212" && (
                    <div className="w-full">
                      <ShowcaseProduct212
                        items={actSho?.items}
                        isArabic={isArabic}
                      />
                    </div>
                  )}

                  {layoutType === "121" && (
                    <ShowcaseProduct121
                      items={actSho?.items}
                      isArabic={isArabic}
                    />
                  )}
                </div>
              </ShowcaseSection>
            );
          })}
        </MaxWidthWrapper>
      </div>
    );
  }

  return null;
};

export default memo(HomeShowcaseContent);
