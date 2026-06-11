"use client";

import { memo } from "react";
import { useSubCategories } from "@/contexts/SubCategoriesContext";
import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import SubCategoryCard from "./SubCategoryCard";
import { useSubCategoriesQuery } from "@/hooks/react-query/useSubCategoriesQuery";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "use-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const SubCategoriesList = () => {
  const tg = useTranslations("general");
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const {
    queryKey,
    searchQuery,
    deleteSubCategory,
    unDeleteSubCategory,
    switchSubCategoryActiveStatus,
    selectedCatId,
  } = useSubCategories();

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
  } = useSubCategoriesQuery({
    search: debouncedSearch,
    catId: selectedCatId,
  });

  const subCategories = data?.pages.flatMap((page) => page.data) || [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = subCategories?.length === 0 && !showLoader;
  const showData = subCategories?.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/sub-categories"} />;
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
        list={subCategories}
        fetchNextPage={fetchNextPage}
        ListItemCard={SubCategoryCard}
        layout="grid"
        gridType="wide"
        cardProps={{
          deleteSubCategory,
          unDeleteSubCategory,
          switchSubCategoryActiveStatus,
          queryKey,
        }}
      />
    );
  }

  return null;
};

export default memo(SubCategoriesList);
