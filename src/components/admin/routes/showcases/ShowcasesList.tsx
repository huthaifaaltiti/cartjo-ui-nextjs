"use client";

import { memo } from "react";
import { useShowcasesQuery } from "@/hooks/react-query/useShowcasesQuery";
import InfiniteScrollList, {
  GRID_TYPE,
} from "../../../shared/InfiniteScrollList";
import { useShowcases } from "@/contexts/Showcase.context";
import ShowcaseCard from "./ShowcaseCard";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const ShowcasesList = () => {
  const tg = useTranslations("general");
  const t = useTranslations("routes.dashboard.routes.showcases");

  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const {
    queryKey,
    searchQuery,
    deleteShowcase,
    unDeleteShowcase,
    switchShowcaseActiveStatus,
  } = useShowcases();

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
  } = useShowcasesQuery({ search: debouncedSearch });

  const showcases = data?.pages.flatMap((page) => page.data) ?? [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = showcases.length === 0 && !showLoader;
  const showData = showcases.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/showcases"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage message={error?.message || t("failed")} />
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
        list={showcases}
        fetchNextPage={fetchNextPage}
        ListItemCard={ShowcaseCard}
        layout="grid"
        gridType={GRID_TYPE.WIDE}
        cardProps={{
          deleteShowcase,
          unDeleteShowcase,
          switchShowcaseActiveStatus,
          queryKey,
        }}
      />
    );
  }

  return null;
};

export default memo(ShowcasesList);
