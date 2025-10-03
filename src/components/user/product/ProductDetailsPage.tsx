"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useProductQuery } from "@/hooks/react-query/useProductQuery";
import ErrorMessage from "@/components/shared/ErrorMessage";
import ProductDetailsSkeleton from "./ProductDetailsSkeleton";
import ProductDetailsContent from "./ProductDetailsContent";
import NoProductFound from "./NoProductFound";
import { getQueryUIState } from "@/utils/uiStateHelpers";
import { Product } from "@/types/product.type";
import ProductComments from "./ProductComments";
import RecommendedProducts from "./recommended-products/RecommendedProducts";

const ProductDetailsPage = ({ productId }: { productId: string }) => {
  const t = useTranslations();
  const { data, isLoading, isFetching, isFetched, isError, error } =
    useProductQuery({ lang: "en", productId });

  const product = useMemo(() => data?.data ?? null, [data]);

  const { showLoader, showError, showNoData, showData } =
    getQueryUIState<Product>({
      data: product,
      isLoading,
      isFetching,
      isFetched,
      isError,
      error,
      isSuccess: data?.isSuccess ?? false,
    });

  const handleGoBack = () => {
    console.log("Going back to previous page");
    alert("Going back to previous page");
  };

  const handleRetry = () => {
    console.log("Retrying to fetch product");
    alert("Retrying to fetch product");
  };

  const handleSearchSimilar = (query: string) => {
    console.log("Searching for:", query);
    alert(`Searching for: ${query}`);
  };

  const containerClass = "w-full min-h-40 flex items-center justify-center";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("routes.product.components.ProductDetailsPage.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <NoProductFound
          productId={productId}
          onGoBack={handleGoBack}
          onRetry={handleRetry}
          onSearchSimilar={handleSearchSimilar}
          showSuggestions={true}
        />
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <div className="w-full flex flex-col gap-3">
          <ProductDetailsContent product={product!} />
          <ProductComments productId={product!._id} />
          <div className="w-full border-t border-gray-200/50 py-8">
            <RecommendedProducts />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(ProductDetailsPage);
