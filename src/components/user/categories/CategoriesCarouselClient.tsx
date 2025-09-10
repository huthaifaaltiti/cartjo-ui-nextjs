"use client";

import { memo, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLocale, useTranslations } from "next-intl";

import { useCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { isArabicLocale } from "@/config/locales.config";

import { Category } from "@/types/category.type";

import CategoryCard from "./CategoryCard";
import LoadingDotsFlexible from "@/components/shared/loaders/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";

const CategoriesCarouselClient = () => {
  const { data, isLoading, isFetching, error, isError } = useCategoriesQuery();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const t = useTranslations();

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
        <Carousel
          plugins={[
            Autoplay({
              delay: 4000,
              stopOnInteraction: false,
            }),
          ]}
          opts={{
            loop: true,
            align: "end",
            skipSnaps: false,
            dragFree: true,
            containScroll: "trimSnaps",
            startIndex: categories.length,
            direction: isArabic ? "rtl" : "ltr",
          }}
          className="w-full"
        >
          <CarouselContent>
            {duplicatedCategories.map((category, index) => (
              <CarouselItem
                key={`${category._id}-${index}`}
                className="basis-1/3 md:basis-1/5 lg:basis-1/6"
              >
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
};

export default memo(CategoriesCarouselClient);
