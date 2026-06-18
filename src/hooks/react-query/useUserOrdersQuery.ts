"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { getUserOrdersQueryOptions } from "./query-options/userOrders";
import { authFetcher } from "@/utils/authFetcher";
import { fetchUserOrders } from "@/services/order.service";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

export const useUserOrdersQuery = (search?: string) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Order>>({
    ...getUserOrdersQueryOptions({
      locale,
      uid: userId ?? "",
      search,
      queryFn: (context) =>
        fetchUserOrders({
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
