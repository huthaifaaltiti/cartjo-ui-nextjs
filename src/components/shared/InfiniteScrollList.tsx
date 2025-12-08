"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/shared/ErrorMessage";
import FoundItemsCount from "./FoundItemsCount";

type Props<T, P extends object = Record<string, unknown>> = {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  error?: Error | null;
  list: T[];
  fetchNextPage?: () => void;
  ListItemCard: React.ComponentType<{ item: T } & P>;
  cardProps?: P;
  layout?: "grid" | "list";
  gridType?: (typeof GRID_TYPE)[keyof typeof GRID_TYPE];
  showNumFoundItems?: boolean;
};

export const GRID_TYPE = {
  WIDE: "wide",
  NARROW: "narrow",
} as const;

function InfiniteScrollList<T, P extends object = Record<string, unknown>>({
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  error,
  list,
  fetchNextPage,
  ListItemCard,
  cardProps,
  layout = "grid",
  gridType = GRID_TYPE.NARROW,
  showNumFoundItems = true,
}: Props<T, P>) {
  const t = useTranslations();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry.isIntersecting &&
        hasNextPage &&
        !isFetchingNextPage &&
        fetchNextPage
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el || !fetchNextPage) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: "100px",
    });

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleObserver, fetchNextPage]);

  return (
    <div className="space-y-4">
      {showNumFoundItems && (
        <div className="flex justify-between items-center">
          <FoundItemsCount isLoading={isLoading} count={list.length} />
        </div>
      )}

      <div
        className={
          layout === "grid"
            ? gridType === GRID_TYPE.NARROW
              ? "w-full grid grid-cols-2 max-[300px]:grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center"
              : "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-4"
        }
      >
        {list.map((item, index) => (
          <ListItemCard key={index} item={item} {...(cardProps as P)} />
        ))}
      </div>

      {(isLoading || isFetchingNextPage) && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      <div ref={loadMoreRef} className="h-4" />

      {!hasNextPage && list.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          {t("general.items.noMoreItems")}
        </div>
      )}

      {!isLoading && list.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t("general.items.noItemsFound")}
        </div>
      )}

      {error && list.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <ErrorMessage message={t("general.errors.data.fetchingFailure")} />
        </div>
      )}
    </div>
  );
}

export default memo(InfiniteScrollList) as typeof InfiniteScrollList;
