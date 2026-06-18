"use client";

import { memo } from "react";
import { useProductsQuery } from "@/hooks/react-query/useProductsQuery";
import InfiniteScrollList, {
  GRID_TYPE,
} from "../../../shared/InfiniteScrollList";
import { useProducts } from "@/contexts/Products.context";
import DashboardProductCard from "./DashboardProductCard";
import { ViewMode } from "@/enums/viewMode.enum";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const ProductsList = () => {
  const tg = useTranslations("general");
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const {
    queryKey,
    searchQuery,
    deleteProduct,
    unDeleteProduct,
    switchProductActiveStatus,
  } = useProducts();

  const debouncedSearch = useDebounce<string>({
    value: searchQuery,
    delay: debouncingTime,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useProductsQuery({
    search: debouncedSearch,
    viewMode: ViewMode.ADMIN,
  });

  const products = data?.pages.flatMap((page) => page.data) || [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = products?.length === 0 && !showLoader;
  const showData = products?.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/products"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage message={error?.message || tg("data.failed")} />
      </div>
    );
  }

  if (showNoData) {
    return (
      <>
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">{tg("data.noData")}</p>
        </div>
      </>
    );
  }

  if (showData) {
    return (
      <InfiniteScrollList
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        list={products}
        fetchNextPage={fetchNextPage}
        ListItemCard={DashboardProductCard}
        layout="grid"
        gridType={GRID_TYPE.WIDE}
        cardProps={{
          deleteProduct,
          unDeleteProduct,
          switchProductActiveStatus,
          queryKey,
        }}
      />
    );
  }

  return null;
};

export default memo(ProductsList);
