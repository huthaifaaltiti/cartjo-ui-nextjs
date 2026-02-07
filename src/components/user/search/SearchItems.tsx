"use client";

import { memo, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useSearchProductsQuery } from "@/hooks/react-query/useSearchQuery";
import { Product } from "@/types/product.type";
import InfiniteScrollList, {
  GRID_TYPE,
} from "@/components/shared/InfiniteScrollList";
import ErrorMessage from "@/components/shared/ErrorMessage";
import SearchProductCard from "./SearchProductCard";
import MainSearchBar from "@/components/MainSearchBar";
import NoSearchText from "./NoSearchText";
import NoSearchItemsFound from "./NoSearchItemsFound";
import SearchQueryFilters from "../SearchQueryFilters";
import SearchItemsLoading from "./SearchItemsLoading";
import RecommendedProducts from "../product/recommended-products/RecommendedProducts";

const SearchItems = () => {
  const t = useTranslations();

  const [q] = useQueryState<string>("q", {
    defaultValue: "",
    parse: (value) => String(value),
    serialize: (value) => String(value),
  });
  const [typeHint] = useQueryState<string>("typeHint", {
    defaultValue: "",
    parse: (value) => String(value),
    serialize: (value) => String(value),
  });
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
  } = useSearchProductsQuery(
    q,
    undefined,
    undefined,
    priceFrom,
    priceTo,
    ratingFrom,
    createdFrom,
    createdTo,
    beforeNumOfDays,
    typeHint,
  );

  const searchProducts = useMemo(() => {
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

  const isEmptySearch = !q?.trim() && !typeHint.trim();
  const showError = isError && error?.message;
  const showNoData = !isFetching && !showError && searchProducts.length === 0;
  const showData = searchProducts.length > 0;
  const showLoader = isLoading;

  const containerClass = "w-full my-3 mb-5";

  if (isEmptySearch) {
    return (
      <div className={`${containerClass} flex flex-col gap-12`}>
        <NoSearchText />
        <RecommendedProducts />
      </div>
    );
  }

  if (showLoader) {
    return (
      <div className={containerClass}>
        <SearchItemsLoading />
      </div>
    );
  }

  if (showError) {
    return (
      <div className={containerClass}>
        <MainSearchBar />
        <ErrorMessage
          message={
            error?.message || t("routes.search.components.SearchItems.failed")
          }
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <div className={containerClass}>
        <div className="w-full flex flex-col gap-4">
          <MainSearchBar />
          <SearchQueryFilters
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
          <NoSearchItemsFound />;
        </div>
      </div>
    );
  }

  if (showData) {
    return (
      <div className={containerClass}>
        <div className="w-full flex flex-col gap-4">
          <MainSearchBar />

          <SearchQueryFilters
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

          <InfiniteScrollList
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            error={error}
            list={searchProducts}
            fetchNextPage={fetchNextPage}
            ListItemCard={SearchProductCard}
            cardProps={{}}
            gridType={GRID_TYPE.NARROW}
          />
        </div>
      </div>
    );
  }

  return null;
};

export default memo(SearchItems);
