"use client";

import { memo } from "react";
import InfiniteScrollList, {
  GRID_TYPE,
  LAYOUT_TYPE,
} from "../../../shared/InfiniteScrollList";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";
import { useTypeHintConfigsQuery } from "@/hooks/react-query/useTypeHintConfigsQuery";
import TypeHintConfigCard from "./TypeHintConfigCard";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const TypeHintConfigsList = () => {
  const tg = useTranslations("general");

  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const {
    queryKey,
    searchQuery,
    deleteTypeHintConfig,
    unDeleteTypeHintConfig,
    switchTypeHintConfigActiveStatus,
  } = useTypeHintConfig();

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
  } = useTypeHintConfigsQuery({ search: debouncedSearch });

  const typeHintConfigs = data?.pages.flatMap((page) => page.data) || [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = typeHintConfigs.length === 0 && !showLoader;
  const showData = typeHintConfigs.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/type-hint-configs"} />;
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
        list={typeHintConfigs}
        fetchNextPage={fetchNextPage}
        ListItemCard={TypeHintConfigCard}
        layout={LAYOUT_TYPE.GRID}
        gridType={GRID_TYPE.WIDE}
        cardProps={{
          deleteTypeHintConfig,
          unDeleteTypeHintConfig,
          switchTypeHintConfigActiveStatus,
          queryKey,
        }}
      />
    );
  }

  return null;
};

export default memo(TypeHintConfigsList);
