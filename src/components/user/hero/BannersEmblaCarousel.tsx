"use client";

import React, { memo, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";

import { useActiveBannersQuery } from "@/hooks/react-query/useBannersQuery";
import { isArabicLocale } from "@/config/locales.config";

import { Banner } from "@/types/banner.type";

import LoadingDotsFlexible from "@/components/shared/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import EmblaBannerCard from "./EmblaBannerCard";

import "./BannersCarouselClient.css";

const BannersEmblaCarousel = () => {
  const { data, isLoading, isFetching, error, isError } =
    useActiveBannersQuery();

  const locale = useLocale();
  const t = useTranslations();
  const isArabic = isArabicLocale(locale);

  const banners: Banner[] =
    data?.pages?.flatMap((page) => page.data || []) ?? [];

  const hasMultipleBanners = banners.length > 1;

  const duplicatedBanners: Banner[] = useMemo(() => {
    if (banners.length <= 1) return banners;
    return Array.from({ length: 4 }).flatMap(() => banners);
  }, [banners]);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      direction: isArabic ? "rtl" : "ltr",
      align: "start",
      skipSnaps: false,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    hasMultipleBanners
      ? [Autoplay({ delay: 6000, stopOnInteraction: false })]
      : []
  );

  const showLoader: boolean =
    (!isLoading && !isFetching && !isError && !data) || isLoading || isFetching;
  const showNoData: boolean =
    !isLoading && !isFetching && banners?.length === 0 && !isError;
  const showData: boolean = !isLoading && !isFetching && banners?.length > 0;
  const showError: boolean = isError;

  const containerClass =
    "w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center border-b";

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
            error?.message || t("components.BannersCarouselClient.failedLoad")
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
            {duplicatedBanners.map((banner, index) => (
              <EmblaBannerCard
                key={banner?._id + index || index}
                banner={banner}
                isArabic={isArabic}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(BannersEmblaCarousel);
