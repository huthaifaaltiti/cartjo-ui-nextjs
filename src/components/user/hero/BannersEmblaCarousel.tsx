"use client";

import React, { memo, useEffect, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale, useTranslations } from "next-intl";
import { useActiveBannersQuery } from "@/hooks/react-query/useBannersQuery";
import { isArabicLocale } from "@/config/locales.config";
import LoadingDotsFlexible from "@/components/shared/loaders/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import EmblaBannerCard from "./EmblaBannerCard";
import { useHomeEffectsContext } from "@/contexts/HomeEffectsContext";
import styles from "./BannersCarouselClient.module.css";

const BannersEmblaCarousel = () => {
  const locale = useLocale();
  const t = useTranslations();
  const isArabic = isArabicLocale(locale);
  const { changeBanners, setChangeBanners } = useHomeEffectsContext();
  const { data, isLoading, isFetching, error, isError, refetch } =
    useActiveBannersQuery();
  const finalBanners = useMemo(() => {
    return data?.data ?? [];
  }, [data]);
  const duplicatedBanners = useMemo(() => {
    if (finalBanners.length <= 1) return finalBanners;

    return Array.from({ length: 4 }).flatMap(() => finalBanners);
  }, [finalBanners]);

  const showLoader =
    (!isLoading && !isFetching && !isError && !data?.isSuccess) ||
    isLoading ||
    isFetching;
  const showError = isError;
  const showNoData = !showLoader && !showError && finalBanners.length === 0;
  const showData = !showLoader && !showError && finalBanners.length > 0;
  const containerClass =
    "w-auto h-[250px] md:h-[350px] lg:h-[450px] flex items-center justify-center border-b";

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      direction: isArabic ? "rtl" : "ltr",
      align: "start",
      skipSnaps: false,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    finalBanners.length > 1
      ? [Autoplay({ delay: 6000, stopOnInteraction: false })]
      : []
  );

  useEffect(() => {
    if (changeBanners) {
      refetch().finally(() => setChangeBanners(false));
    }
  }, [changeBanners, refetch, setChangeBanners]);

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
        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.embla__container}>
            {duplicatedBanners.map((banner, index) => (
              <div
                key={banner?._id + index || `banner-${index}`}
                className={styles.embla__slide}
              >
                <EmblaBannerCard banner={banner} isArabic={isArabic} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(BannersEmblaCarousel);
