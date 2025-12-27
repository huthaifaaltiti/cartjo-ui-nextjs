"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { GC_TIME } from "@/config/reactQueryOptions";
import { DataListResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { Locale } from "@/types/locale";
import { Order } from "@/types/order.type";

interface FetchUserOrdersParams {
  token: string | null;
  lang?: string | Locale;
  uid: string | null;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchUserOrders = async ({
  token,
  uid,
  lang = "en",
  limit = PAGINATION_LIMITS.USER_ORDERS,
  lastId,
  search,
}: FetchUserOrdersParams): Promise<DataListResponse<Order>> => {
  if (!token) throw new Error("No access token found");
  if (!uid) throw new Error("uid is required");

  const url = new URL(`${API_ENDPOINTS.ORDER.GetMyOrders}/${uid}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang.toString());
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  handleUnauthorizedResponse(res, lang);

  if (!res.ok) throw new Error("Could not retrieve user orders");

  const resObj = await res.json();
  return resObj;
};

export const useUserOrdersQuery = (search?: string) => {
  const { accessToken, locale, status, userId } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Order>>({
    queryKey: ["userOrders", search, locale],
    queryFn: ({ pageParam }) =>
      fetchUserOrders({
        token: accessToken,
        lang: locale,
        uid: userId,
        limit: PAGINATION_LIMITS.USER_ORDERS,
        lastId: pageParam as string,
        search,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.length) return undefined;
      const lastOrder = lastPage.data[lastPage.data.length - 1];
      return lastOrder?._id || undefined;
    },
    initialPageParam: undefined,
    staleTime: 0,
    gcTime: GC_TIME,
    enabled: status !== "loading" && !!accessToken,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: (failureCount, error: any) => {
      // Don't retry if it's an auth error
      if (error?.message?.includes("access token")) return false;
      return failureCount < 3;
    },
  });
};
