"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DataListResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Order } from "@/types/order.type";
import { fetchUserOrderReturns } from "@/services/orderReturn.service";
import { getUserOrderReturnsQueryOptions } from "./query-options/userOrderReturns";
import { authFetcher } from "@/utils/authFetcher";

export const useUserOrdersReturnsQuery = (search?: string) => {
  const { isAuthenticated, isSessionLoading, locale, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Order>>({
    ...getUserOrderReturnsQueryOptions({
      locale,
      uid: userId ?? "",
      search,
      queryFn: (context) =>
        fetchUserOrderReturns({
          uid: userId ?? "",
          lang: locale,
          limit: PAGINATION_LIMITS.USER_VIEW.ORDERS,
          lastId: context.pageParam as string | undefined,
          search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: unknown) => {
      if (error instanceof Error) {
        if (
          error.message.includes("Not authorized") ||
          error.message.includes("No user id")
        ) {
          return false;
        }
      }
      return failureCount < 3;
    },
  });
};
