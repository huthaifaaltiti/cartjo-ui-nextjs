"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { Locale } from "@/types/locale";

export const CART_QUERY_KEY = "cartItems" as const;

interface FetchCartItemsParams {
  token: string | null;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchCartItems = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.CART_ITEMS,
  lastId,
}: FetchCartItemsParams): Promise<DataResponse<Cart>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.CART.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  handleUnauthorizedResponse(res, lang);

  if (!res.ok) throw new Error("Could not retrieve active cart list");

  return await res.json();
};

export const getCartQueryOptions = (token: string) => {
  const getNextPageParam = (lastPage: DataResponse<Cart>) => {
    if (!lastPage?.data?.items?.length) return undefined;

    const lastProduct = lastPage.data.items.at(-1);
    return lastProduct?._id ?? undefined;
  };

  return {
    queryKey: [CART_QUERY_KEY, token],
    queryFn: () =>
      fetchCartItems({
        token,
        lang: "en",
        limit: PAGINATION_LIMITS.CART_ITEMS,
      }),
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};

export const useCartQuery = () => {
  const { accessToken, locale, status } = useAuthContext();

  return useInfiniteQuery<DataResponse<Cart>>({
    queryKey: [CART_QUERY_KEY, accessToken],
    queryFn: ({ pageParam }) => {
      // This should never be reached due to enabled condition, but keeping as safeguard
      if (!accessToken) {
        throw new Error("No access token found");
      }

      return fetchCartItems({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.CART_ITEMS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
      });
    },
    getNextPageParam: (lastPage) => {
      const items = lastPage?.data?.items;

      if (!items?.length) return undefined;

      // If we got fewer items than the limit, we're on the last page
      if (items.length < PAGINATION_LIMITS.CART_ITEMS) return undefined;

      const lastItem = items[items.length - 1];
      return lastItem?.productId?.toString() ?? undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    // KEY FIX: Only enable the query when session is loaded and we have an accessToken
    enabled: status !== "loading" && !!accessToken,
    // refetchOnMount: "always",
    // refetchOnWindowFocus: true,
    refetchOnWindowFocus: false,
    // Optional: Retry configuration
    retry: (failureCount, error) => {
      // Don't retry if it's an auth error
      if (error.message.includes("access token")) return false;

      return failureCount < 3;
    },
  });
};
