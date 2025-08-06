"use client";

import React, { memo, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";

import { useCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { isArabicLocale } from "@/config/locales.config";

import { Category } from "@/types/category";

import LoadingDotsFlexible from "@/components/shared/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import CategoryCard from "./CategoryCard";

import "./CategoriesEmblaCarousel.styles.css";

const CategoriesEmblaCarousel = () => {
  const { data, isLoading, isFetching, error, isError } = useCategoriesQuery();

  const t = useTranslations();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);

  const duplicatedCategories = useMemo(() => {
    return Array.from({ length: 4 }).flatMap(
      () => data?.pages?.flatMap((page) => page.data || []) ?? []
    );
  }, [data]);

  const categories: Category[] =
    data?.pages?.flatMap((page) => page.data || []) ?? [];

  const showLoader: boolean =
    (!isLoading && !isFetching && !isError && !data) || isLoading || isFetching;
  const showNoData: boolean =
    !isLoading && !isFetching && categories?.length === 0 && !isError;
  const showData: boolean = !isLoading && !isFetching && categories?.length > 0;
  const showError: boolean = isError;

  const containerClass = "w-full h-full flex items-center justify-center";

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      direction: isArabic ? "rtl" : "ltr",
      align: "start",
      skipSnaps: false,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    categories.length > 1
      ? [Autoplay({ delay: 4000, stopOnInteraction: false })]
      : []
  );

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
      <div className={containerClass}>
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {duplicatedCategories.map((category, index) => (
              <CategoryCard
                key={category?._id + index || `category-${index}`}
                category={category}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(CategoriesEmblaCarousel);
