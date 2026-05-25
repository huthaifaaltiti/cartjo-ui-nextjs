"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import { authFetcher } from "@/utils/authFetcher";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getWishlistQueryOptions } from "./query-options/wishlist";
import { fetchWishlistItems } from "@/services/wishlist.service";
import { Locale } from "@/types/locale";
import { createRetryHandler } from "@/utils/reactQueryRetry";

export const useWishlistQuery = () => {
  const { isAuthenticated, locale, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataResponse<Wishlist>>({
    ...getWishlistQueryOptions({
      locale,
      queryFn: (context) =>
        fetchWishlistItems({
          lang: locale as Locale,
          limit: PAGINATION_LIMITS.USER_VIEW.WISHLIST_ITEMS,
          lastId: context.pageParam as string | undefined,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    initialData: undefined,
    retry: createRetryHandler(),
  });
};
