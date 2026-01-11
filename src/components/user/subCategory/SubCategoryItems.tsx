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
import PriceRange from "../used-filters/PriceRange";
import RatingRange from "../used-filters/RatingRange";
import DateRangeWithDaysNum from "../used-filters/DateRangeWithDaysNum";

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
    }
  );

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
  } = useSubCategoryProductsQuery(
    categoryId,
    subCategoryId,
    priceFrom,
    priceTo,
    ratingFrom,
    createdFrom,
    createdTo,
    beforeNumOfDays
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
    [refetch, setPriceFrom, setPriceTo]
  );

  const handleApplyRangeFilter = useCallback(
    (from: number) => {
      setRatingFrom(from);
      refetch();
    },
    [refetch, setRatingFrom]
  );

  const handleApplyDateFilter = useCallback(
    (
      filterType: "dateRange" | "daysBefore",
      createdFromValue?: string,
      createdToValue?: string,
      beforeNumOfDaysValue?: number
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
    [refetch, setCreatedFrom, setCreatedTo, setBeforeNumOfDays]
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
  const showNoData =
    !showLoader && !showError && subCategoryProducts.length === 0;
  const showData = !showLoader && !showError && subCategoryProducts.length > 0;

  const containerClass = "w-full min-h-40 flex items-center justify-center";

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
          {/* Filters */}
          <div className="w-full flex items-center gap-4 border-b border-grey-50/20 py-1">
            <PriceRange
              setPriceFrom={setPriceFrom}
              setPriceTo={setPriceTo}
              onApplyFilter={handleApplyPriceFilter}
              initialFrom={priceFrom}
              initialTo={priceTo}
            />
            <RatingRange
              setRatingFrom={setRatingFrom}
              onApplyFilter={handleApplyRangeFilter}
              initialFrom={ratingFrom}
            />
            <DateRangeWithDaysNum
              setCreatedFrom={setCreatedFrom}
              setCreatedTo={setCreatedTo}
              setBeforeNumOfDays={setBeforeNumOfDays}
              onApplyFilter={handleApplyDateFilter}
              initialCreatedFrom={createdFrom}
              initialCreatedTo={createdTo}
              initialBeforeNumOfDays={beforeNumOfDays}
            />
          </div>

          {/* items */}
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
          {/* Filters */}
          <div className="w-full flex items-center gap-4 border-b border-grey-50/20 py-1">
            <PriceRange
              setPriceFrom={setPriceFrom}
              setPriceTo={setPriceTo}
              onApplyFilter={handleApplyPriceFilter}
              initialFrom={priceFrom}
              initialTo={priceTo}
            />
            <RatingRange
              setRatingFrom={setRatingFrom}
              onApplyFilter={handleApplyRangeFilter}
              initialFrom={ratingFrom}
            />
            <DateRangeWithDaysNum
              setCreatedFrom={setCreatedFrom}
              setCreatedTo={setCreatedTo}
              setBeforeNumOfDays={setBeforeNumOfDays}
              onApplyFilter={handleApplyDateFilter}
              initialCreatedFrom={createdFrom}
              initialCreatedTo={createdTo}
              initialBeforeNumOfDays={beforeNumOfDays}
            />
          </div>

          {/* items */}
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
