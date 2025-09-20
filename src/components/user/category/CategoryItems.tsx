"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Product } from "@/types/product.type";
import { useCategoryProductsQuery } from "@/hooks/react-query/useCategoryQuery";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoCategoryItems from "./NoCategoryItems";
import CategoryProductCard from "./CategoryProductCard";
import CategoryItemsLoading from "./CategoryItemsLoading";

const CategoryItems = ({ categoryId }: { categoryId: string }) => {
  const t = useTranslations();

  const {
    data,
    isLoading,
    isFetching,
    isFetched,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useCategoryProductsQuery(categoryId);

  const categoryProducts = useMemo(() => {
    const allProducts =
      (data?.pages?.flatMap((page) => page?.data || []) as Product[]) ?? [];

    return allProducts;
  }, [data]);

  const showLoader =
    (!isLoading &&
      !isFetching &&
      !isFetched &&
      !isError &&
      !data?.pages[0]?.isSuccess) ||
    isLoading ||
    isFetching;
  const showError = isFetched && isError && error?.message;
  const showNoData = !showLoader && !showError && categoryProducts.length === 0;
  const showData = !showLoader && !showError && categoryProducts.length > 0;

  const containerClass = "w-full pt-5";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <CategoryItemsLoading />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("routes.categories.components.CategoryItems.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <NoCategoryItems />;
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <InfiniteScrollList
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          error={error}
          list={categoryProducts}
          fetchNextPage={fetchNextPage}
          ListItemCard={CategoryProductCard}
          cardProps={{}}
        />
      </div>
    );
  }

  return null;
};

export default memo(CategoryItems);
