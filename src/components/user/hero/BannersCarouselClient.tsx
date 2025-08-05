"use client";

import { memo, useMemo } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useLocale, useTranslations } from "next-intl";

import { useActiveBannersQuery } from "@/hooks/react-query/useBannersQuery";
import { isArabicLocale } from "@/config/locales.config";

import { Banner } from "@/types/banner.type";

import LoadingDotsFlexible from "@/components/shared/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";

import "./BannersCarouselClient.css";

const BannersCarouselClient = () => {
  const { data, isLoading, isFetching, error, isError } =
    useActiveBannersQuery();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const t = useTranslations();

  const duplicatedBanners: Banner[] = useMemo(() => {
    const originalBanners =
      data?.pages
        ?.flatMap((page) => page.data || [])
        .filter((banner) => banner?.isActive) ?? [];

    if (originalBanners.length <= 1) return originalBanners;

    return Array.from({ length: 4 }).flatMap(() => originalBanners);
  }, [data]);

  const banners: Banner[] =
    data?.pages?.flatMap((page) => page.data || []) ?? [];

  const showLoader: boolean =
    (!isLoading && !isFetching && !isError && !data) || isLoading || isFetching;
  const showNoData: boolean =
    !isLoading && !isFetching && banners?.length === 0 && !isError;
  const showData: boolean = !isLoading && !isFetching && banners?.length > 0;
  const showError: boolean = isError;
  const hasMultipleBanners: boolean = banners?.length > 1;

  const containerClass =
    "w-full h-[100px] md:h-[200px] lg:h-[300px] flex items-center justify-center border-b";

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
      <div className="w-full h-full border-b">
        <Carousel
          plugins={
            hasMultipleBanners
              ? [Autoplay({ delay: 6000, stopOnInteraction: false })]
              : []
          }
          opts={{
            loop: true,
            align: "start",
            skipSnaps: false,
            dragFree: true,
            containScroll: "trimSnaps",
            startIndex: banners.length,
            direction: isArabic ? "rtl" : "ltr",
          }}
          className="w-full h-full embla"
        >
          <CarouselContent className="w-full h-[100px] md:h-[200px] lg:h-[300px] embla__container">
            {duplicatedBanners.map((banner, index) => (
              <CarouselItem
                key={`${banner._id}-${index}`}
                // className="embla__slide basis-full"
                className="basis-full embla__slide"
              >
                <div className="w-full h-full">
                  <div className="w-full h-full overflow-hidden">
                    <img
                      src={
                        isArabic
                          ? banner?.media?.ar?.url
                          : banner?.media?.en?.url
                      }
                      alt={banner?.title?.[isArabic ? "ar" : "en"] || "Banner"}
                      // fill // Fills the parent container
                      className="h-full w-full object-fill"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }
};

export default memo(BannersCarouselClient);
