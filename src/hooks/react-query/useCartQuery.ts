"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Locale } from "@/types/locale";
import { authFetcher } from "@/utils/authFetcher";
import { fetchCartItems } from "@/services/cart.service";
import { createRetryHandler } from "@/utils/reactQueryRetry";
import { getCartQueryOptions } from "./query-options/cart";

export const useCartQuery = () => {
  const { locale, isSessionLoading, isAuthenticated, userId } =
    useAuthContext();

  return useInfiniteQuery<DataResponse<Cart>>({
    ...getCartQueryOptions({
      locale,
      queryFn: (context) =>
        fetchCartItems({
          lang: locale as Locale,
          limit: PAGINATION_LIMITS.USER_VIEW.WISHLIST_ITEMS ?? 20,
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
