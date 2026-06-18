"use client";

import { memo } from "react";
import { useCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { useCategories } from "@/contexts/CategoriesContext";
import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import CategoryCard from "./CategoryCard";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useTranslations } from "next-intl";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const CategoriesList = () => {
  const tg = useTranslations("general");
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const {
    queryKey,
    searchQuery,
    deleteCategory,
    unDeleteCategory,
    switchCategoryActiveStatus,
  } = useCategories();

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
  } = useCategoriesQuery(debouncedSearch);

  const categories = data?.pages.flatMap((page) => page.data) || [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = categories?.length === 0 && !showLoader;
  const showData = categories?.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/categories"} />;
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
        list={categories}
        fetchNextPage={fetchNextPage}
        ListItemCard={CategoryCard}
        layout="grid"
        gridType="wide"
        cardProps={{
          deleteCategory,
          unDeleteCategory,
          switchCategoryActiveStatus,
          queryKey,
        }}
      />
    );
  }

  return null;
};

export default memo(CategoriesList);
