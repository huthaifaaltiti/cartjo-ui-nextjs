"use client";

import { memo, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useSubCategoryProductsQuery } from "@/hooks/react-query/useSubCategoryQuery";
import { Product } from "@/types/product.type";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import ErrorMessage from "@/components/shared/ErrorMessage";
import NoSubCategoryItems from "./NoSubCategoryItems";
import SubCategoryProductCard from "./SubCategoryProductCard";
import GridItemsSkeleton from "@/components/shared/loaders/GridItemsSkeleton";
import SearchQueryFilters from "../SearchQueryFilters";

const SubCategoryItems = ({
  categoryId,
  subCategoryId,
}: {
  categoryId: string;
  subCategoryId: string;
}) => {
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
  const [createdFrom, setCreatedFrom] = useQueryState<string>("createdFrom", {
    defaultValue: "",
    parse: (value) => value || "",
    serialize: (value) => value,
  });
  const [createdTo, setCreatedTo] = useQueryState<string>("createdTo", {
    defaultValue: "",
    parse: (value) => value || "",
    serialize: (value) => value,
  });
  const [beforeNumOfDays, setBeforeNumOfDays] = useQueryState<number>(
    "beforeNumOfDays",
    {
      defaultValue: 0,
      parse: (value) => Number(value),
      serialize: (value) => String(value),
    },
  );

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useSubCategoryProductsQuery(
    categoryId,
    subCategoryId,
    priceFrom,
    priceTo,
    ratingFrom,
    createdFrom,
    createdTo,
    beforeNumOfDays,
  );

  const subCategoryProducts = useMemo(() => {
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
    [refetch, setPriceFrom, setPriceTo],
  );

  const handleApplyRangeFilter = useCallback(
    (from: number) => {
      setRatingFrom(from);
      refetch();
    },
    [refetch, setRatingFrom],
  );

  const handleApplyDateFilter = useCallback(
    (
      filterType: "dateRange" | "daysBefore",
      createdFromValue?: string,
      createdToValue?: string,
      beforeNumOfDaysValue?: number,
    ) => {
      if (filterType === "dateRange") {
        setCreatedFrom(createdFromValue || "");
        setCreatedTo(createdToValue || "");
        setBeforeNumOfDays(0);
      } else {
        setBeforeNumOfDays(beforeNumOfDaysValue || 0);
        setCreatedFrom("");
        setCreatedTo("");
      }
      refetch();
    },
    [refetch, setCreatedFrom, setCreatedTo, setBeforeNumOfDays],
  );

  const handleClearFilters = useCallback(() => {
    setPriceFrom(0);
    setPriceTo(0);
    setRatingFrom(0);
    setCreatedFrom("");
    setCreatedTo("");
    setBeforeNumOfDays(0);
    refetch();
  }, [
    refetch,
    setPriceFrom,
    setPriceTo,
    setRatingFrom,
    setCreatedFrom,
    setCreatedTo,
    setBeforeNumOfDays,
  ]);

  const hasActiveFilters =
    priceFrom > 0 ||
    priceTo > 0 ||
    ratingFrom > 0 ||
    !!createdFrom ||
    !!createdTo ||
    beforeNumOfDays > 0;

  const showError = isError && error?.message;
  const showNoData =
    !isFetching && !showError && subCategoryProducts.length === 0;
  const showData = subCategoryProducts.length > 0;
  const showLoader = isLoading;

  const containerClass =
    "w-full min-h-40 flex items-center justify-center mb-5";

  if (showLoader) {
    return (
      <div className={containerClass}>
        <GridItemsSkeleton />
      </div>
    );
  }
  if (showError) {
    return (
      <div className={containerClass}>
        <ErrorMessage
          message={
            error?.message ||
            t("routes.subCategory.components.SubCategoryItems.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <div className="w-full flex flex-col gap-4">
          <SearchQueryFilters
            hasActiveFilters={hasActiveFilters}
            priceFrom={priceFrom}
            priceTo={priceTo}
            ratingFrom={ratingFrom}
            createdFrom={createdFrom}
            createdTo={createdTo}
            beforeNumOfDays={beforeNumOfDays}
            setPriceFrom={setPriceFrom}
            setPriceTo={setPriceTo}
            setRatingFrom={setRatingFrom}
            setCreatedFrom={setCreatedFrom}
            setCreatedTo={setCreatedTo}
            setBeforeNumOfDays={setBeforeNumOfDays}
            onApplyPriceFilter={handleApplyPriceFilter}
            onApplyRangeFilter={handleApplyRangeFilter}
            onApplyDateFilter={handleApplyDateFilter}
            onClearFilters={handleClearFilters}
          />

          <div className="w-full">
            <NoSubCategoryItems />;
          </div>
        </div>
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <div className="w-full flex flex-col gap-4">
          <SearchQueryFilters
            hasActiveFilters={hasActiveFilters}
            priceFrom={priceFrom}
            priceTo={priceTo}
            ratingFrom={ratingFrom}
            createdFrom={createdFrom}
            createdTo={createdTo}
            beforeNumOfDays={beforeNumOfDays}
            setPriceFrom={setPriceFrom}
            setPriceTo={setPriceTo}
            setRatingFrom={setRatingFrom}
            setCreatedFrom={setCreatedFrom}
            setCreatedTo={setCreatedTo}
            setBeforeNumOfDays={setBeforeNumOfDays}
            onApplyPriceFilter={handleApplyPriceFilter}
            onApplyRangeFilter={handleApplyRangeFilter}
            onApplyDateFilter={handleApplyDateFilter}
            onClearFilters={handleClearFilters}
          />

          <div className="w-full">
            <InfiniteScrollList
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              error={error}
              list={subCategoryProducts}
              fetchNextPage={fetchNextPage}
              ListItemCard={SubCategoryProductCard}
              cardProps={{}}
            />
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default memo(SubCategoryItems);
