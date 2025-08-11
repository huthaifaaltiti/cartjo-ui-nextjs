"use client";

import { memo, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { fetchActiveShowcases } from "@/hooks/react-query/useShowcasesQuery";

import { Showcase } from "@/types/showcase.type";

import MaxWidthWrapper from "@/components/shared/MaxWidthWrapper";
import ShowcaseSection from "./ShowcaseSection";
import { useShowcases } from "@/contexts/Showcase.context";
import LoadingDotsFlexible from "@/components/shared/LoadingDotsFlexible";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoData from "@/components/shared/NoData";
import { isArabicLocale } from "@/config/locales.config";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useTypeHints } from "@/hooks/useTypeHints";

const HomeShowcaseContent = () => {
  const locale = useLocale();
  const isArabic = isArabicLocale(locale);
  const t = useTranslations();
  const { accessToken } = useShowcases();

  const x = useTypeHints();

  console.log({ x });

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeShowcasesList, setActiveShowcasesList] = useState<Showcase[]>(
    []
  );

  const showLoader =
    (!isLoading && activeShowcasesList.length === 0) || isLoading;
  const showNoData = !isLoading && activeShowcasesList.length === 0 && !isError;
  const showError = isError;
  const showData = !isLoading && !isError && activeShowcasesList.length > 0;

  const containerClass = "w-full h-full flex items-center justify-center";

  useEffect(() => {
    const fetchShowcases = async () => {
      if (!accessToken) return;

      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        const showcasesResp = await fetchActiveShowcases({
          token: accessToken,
          lang: locale,
        });

        if (showcasesResp?.isSuccess) {
          setActiveShowcasesList([...showcasesResp.data]);
          console.log(showcasesResp.data);
        } else {
          setIsError(true);
          setError(new Error("Failed to fetch showcases"));
        }
      } catch (error) {
        console.error("Error fetching showcases:", error);
        setIsError(true);
        setError(error instanceof Error ? error : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchShowcases();
  }, [accessToken, locale]);

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
        <MaxWidthWrapper className="w-full py-14 flex flex-col gap-8">
          {activeShowcasesList?.map((actSho, i) => (
            <ShowcaseSection
              key={actSho?._id + i}
              header={isArabic ? actSho?.title?.ar : actSho?.title?.en}
              desc={
                isArabic ? actSho?.description?.ar : actSho?.description?.en
              }
              uri={actSho?.showAllButtonLink}
            >
              <div className="w-full flex flex-wrap gap-4">
                {actSho?.items?.map((item, itemIndex) => {
                  const yellowStars = Math.floor(item?.ratings || 0);
                  const greyStars = 5 - yellowStars;

                  return (
                    <div
                      key={item?._id + itemIndex}
                      className="relative min-w-[200px] flex-1 border rounded-lg p-4"
                    >
                      {item?.discountRate > 0 && (
                        <span className="text-sm text-white-50 bg-[#DC2626] absolute top-5 left-5 py-1 px-2 rounded-lg">
                          {item?.discountRate}%
                        </span>
                      )}

                      <span className="absolute top-5 right-5">
                        <Heart />
                      </span>

                      <div className="w-full">
                        <img
                          src={item?.mainImage}
                          alt={isArabic ? item?.name?.ar : item?.name?.en}
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />

                        <span className="absolute top-[50%] text-xs">
                          {item?.typeHint}
                        </span>

                        <p className="text-lg font-medium mb-2">
                          {isArabic ? item?.name?.ar : item?.name?.en}
                        </p>

                        <div className="w-auto flex items-center gap-1">
                          {Array.from(
                            { length: yellowStars },
                            (_, starIndex) => (
                              <Star
                                key={`yellow-${starIndex}`}
                                className="w-4 h-4 text-yellow-500 fill-yellow-500"
                              />
                            )
                          )}
                          {Array.from({ length: greyStars }, (_, starIndex) => (
                            <Star
                              key={`grey-${starIndex}`}
                              className="w-4 h-4 text-gray-300 fill-gray-300"
                            />
                          ))}
                          <span className="mx-2 text-sm text-gray-600">
                            ({item?.ratings || 0})
                          </span>
                        </div>

                        <div className="w-full">
                          {item?.discountRate ? (
                            <div className="w-full flex items-center gap-1">
                              <span className="text-[#DC2626] font-extrabold">
                                <span>{item?.currency}</span>{" "}
                                <span>
                                  {item?.price -
                                    (item?.discountRate / 100) * item?.price}
                                </span>
                              </span>

                              <span className="relative text-sm before:absolute before:w-full before:h-[1px] before:bg-black-500 before:top-1/2 before:-translate-y-1/2">
                                {item?.currency} {item?.price}
                              </span>
                            </div>
                          ) : (
                            <div>
                              <span>
                                {item?.price} {item?.currency}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-8 h-8 text-white-50 bg-[#16A34A] p-1 rounded-md" />

                          <span className="uppercase text-sm font-bold text-[#16A34A]">
                            In Stock
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShowcaseSection>
          ))}
        </MaxWidthWrapper>
      </div>
    );
  }

  return null;
};

export default memo(HomeShowcaseContent);
