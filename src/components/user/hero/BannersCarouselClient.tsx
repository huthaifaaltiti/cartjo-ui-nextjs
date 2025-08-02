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
import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import { Button } from "@/components/ui/button";

const BannersCarouselClient = () => {
  const { data, isLoading, isFetching, error, isError } =
    useActiveBannersQuery();
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const t = useTranslations();

  const duplicatedBanners: Banner[] = useMemo(() => {
    const originalBanners =
      data?.pages?.flatMap((page) => page.data || []) ?? [];

    if (originalBanners.length <= 1) return originalBanners;

    return Array.from({ length: 4 }).flatMap(() => originalBanners);
  }, [data]);

  const banners: Banner[] =
    data?.pages?.flatMap((page) => page.data || []) ?? [];

  console.log({ banners });

  const showLoader: boolean =
    (!isLoading && !isFetching && !isError && !data) || isLoading || isFetching;
  const showNoData: boolean =
    !isLoading && !isFetching && banners?.length === 0 && !isError;
  const showData: boolean = !isLoading && !isFetching && banners?.length > 0;
  const showError: boolean = isError;
  const hasMultipleBanners: boolean = banners?.length > 1;

  const containerClass =
    "w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center border-b";

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
        <Carousel
          // plugins={
          //   hasMultipleBanners
          //     ? [Autoplay({ delay: 6000, stopOnInteraction: false })]
          //     : []
          // }
          opts={{
            loop: true,
            align: "end",
            skipSnaps: false,
            dragFree: true,
            containScroll: "trimSnaps",
            startIndex: banners.length,
            direction: isArabic ? "rtl" : "ltr",
          }}
          className="w-full h-full"
        >
          <CarouselContent className="h-full">
            {duplicatedBanners.map((banner, index) => (
              <CarouselItem key={`${banner._id}-${index}`} className="h-full">
                <div
                  className="w-full h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${banner?.media?.url})` }}
                >
                  <MaxWidthWrapper>
                    <div className="w-full h-full flex py-20 px-10 bg-white-50">
                      {/* <div className="w-2/4 flex flex-col gap-2">
                        <div className="w-full ">
                          <span
                            className="shadow-none px-4 py-2 rounded-lg min-w-[100px] inline-block capitalize font-bold"
                            style={{
                              color: labelColors[4],
                              backgroundImage: `linear-gradient(to right,${labelColors[4]}CC 0%, ${labelColors[4]}00 70%, transparent 100%)`,
                            }}
                          >
                            {isArabic ? banner?.label?.ar : banner?.label?.en}
                          </span>
                        </div>
                      </div> */}
                      <div className="w-2/4">2</div>
                    </div>
                  </MaxWidthWrapper>
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
