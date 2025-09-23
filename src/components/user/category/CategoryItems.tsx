"use client";

import { memo, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { Product } from "@/types/product.type";
import { useCategoryProductsQuery } from "@/hooks/react-query/useCategoryQuery";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoCategoryItems from "./NoCategoryItems";
import CategoryProductCard from "./CategoryProductCard";
import CategoryItemsLoading from "./CategoryItemsLoading";
import PriceRange from "../used-filters/PriceRange";
import RatingRange from "../used-filters/RatingRange";

const CategoryItems = ({ categoryId }: { categoryId: string }) => {
  const t = useTranslations();

  const [priceFrom, setPriceFrom] = useQueryState<number>("priceFrom", {
    defaultValue: 0,
    parse: (value) => Number(value),
    serialize: (value) => String(value),
  });

  const [priceTo, setPriceTo] = useQueryState<number>("priceTo", {
    defaultValue: 0,
    parse: (value) => Number(value),
    serialize: (value) => String(value),
  });

  const [ratingFrom, setRatingFrom] = useQueryState<number>("ratingFrom", {
    defaultValue: 0,
    parse: (value) => Number(value),
    serialize: (value) => String(value),
  });

  const [ratingTo, setRatingTo] = useQueryState<number>("ratingTo", {
    defaultValue: 0,
    parse: (value) => Number(value),
    serialize: (value) => String(value),
  });

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
    refetch,
  } = useCategoryProductsQuery(categoryId, priceFrom, priceTo);

  const categoryProducts = useMemo(() => {
    return (
      (data?.pages?.flatMap((page) => page?.data || []) as Product[]) ?? []
    );
  }, [data]);

  const handleApplyPriceFilter = useCallback(
    (from: number, to: number) => {
      setPriceFrom(from);
      setPriceTo(to);
      refetch();
    },
    [refetch, setPriceFrom, setPriceTo]
  );

  const handleApplyRangeFilter = useCallback(
    (from: number, to: number) => {
      setRatingFrom(from);
      setRatingTo(to);
      refetch();
    },
    [refetch, setRatingFrom, setRatingTo]
  );

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
        <div className="w-full flex flex-col gap-4 mt-5">
          {/* Filters */}
          <div className="w-full flex items-center gap-4 border-y border-grey-50/20 py-1">
            <PriceRange
              setPriceFrom={setPriceFrom}
              setPriceTo={setPriceTo}
              onApplyFilter={handleApplyPriceFilter}
              initialFrom={priceFrom}
              initialTo={priceTo}
            />
          </div>

          {/* items */}
          <div className="w-full">
            <NoCategoryItems />;
          </div>
        </div>
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <div className="w-full flex flex-col gap-4 mt-5">
          {/* Filters */}
          <div className="w-full flex items-center gap-4 border-y border-grey-50/20 py-1">
            <PriceRange
              setPriceFrom={setPriceFrom}
              setPriceTo={setPriceTo}
              onApplyFilter={handleApplyPriceFilter}
              initialFrom={priceFrom}
              initialTo={priceTo}
            />

            <RatingRange
              setRatingFrom={setRatingFrom}
              setRatingTo={setRatingTo}
              onApplyFilter={handleApplyRangeFilter}
              initialFrom={ratingFrom}
              initialTo={ratingTo}
            />
          </div>

          {/* items */}
          <div className="w-full">
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
        </div>
      </div>
    );
  }

  return null;
};

export default memo(CategoryItems);
