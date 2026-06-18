"use client";

import { memo } from "react";
import { useLogosQuery } from "@/hooks/react-query/useLogosQuery";
import { useLogos } from "@/contexts/LogosContext";
import InfiniteScrollList, {
  GRID_TYPE,
  LAYOUT_TYPE,
} from "../../../shared/InfiniteScrollList";
import LogoCard from "./LogoCard";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";

const debouncingTime = DEBOUNCE_TIME_MS ?? 750;

const LogosList = () => {
  const tg = useTranslations("general");

  const { isSessionLoading, isAuthenticated } = useAuthContext();
  const {
    queryKey,
    searchQuery,
    deleteLogo,
    unDeleteLogo,
    switchLogoActiveStatus,
  } = useLogos();

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
  } = useLogosQuery(debouncedSearch);

  const logos = data?.pages.flatMap((page) => page.data) ?? [];

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = logos?.length === 0 && !showLoader;
  const showData = logos?.length > 0 && !showLoader;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/logos"} />;
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
        list={logos}
        fetchNextPage={fetchNextPage}
        ListItemCard={LogoCard}
        layout={LAYOUT_TYPE.GRID}
        gridType={GRID_TYPE.WIDE}
        cardProps={{
          deleteLogo,
          unDeleteLogo,
          switchLogoActiveStatus,
          queryKey,
        }}
      />
    );
  }

  return null;
};

export default memo(LogosList);
