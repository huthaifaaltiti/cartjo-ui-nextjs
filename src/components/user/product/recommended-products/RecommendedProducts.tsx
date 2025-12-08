"use client";

import { memo, useMemo } from "react";
import { Product } from "@/types/product.type";
import { useSuggestedProductQuery } from "@/hooks/react-query/useSuggestedProductQuery";
import { useLocale, useTranslations } from "next-intl";
import { getQueryUIState } from "@/utils/uiStateHelpers";
import RecommendedProductsLoading from "./RecommendedProductsLoading";
import ErrorMessage from "@/components/shared/ErrorMessage";
import RecProductsData from "./RecProductsData";

interface RecommendedProductsProps {
  title?: string;
  subtitle?: string;
}

const RecommendedProducts = ({ title, subtitle }: RecommendedProductsProps) => {
  const locale = useLocale();
  const t = useTranslations();
  const { data, isLoading, isFetching, isFetched, isError, error } =
    useSuggestedProductQuery(locale, 4);

  const products = useMemo(() => data?.data ?? null, [data]);

  const { showLoader, showError, showNoData, showData } = getQueryUIState<
    Product[]
  >({
    data: products,
    isLoading,
    isFetching,
    isFetched,
    isError,
    error,
    isSuccess: data?.isSuccess ?? false,
  });

  const containerClass = "w-full min-h-40 flex items-center justify-center";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <RecommendedProductsLoading />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("routes.product.components.RecommendedProducts.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) return null;

  if (showData) {
    return (
      <div className={containerClass}>
        <RecProductsData
          title={title}
          subtitle={subtitle}
          products={products!}
        />
      </div>
    );
  }

  return null;
};

export default memo(RecommendedProducts);
