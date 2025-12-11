"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { GC_TIME } from "@/config/reactQueryOptions";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { Locale } from "@/types/locale";
import { useWishlist } from "@/contexts/Wishlist.context";

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

  const resObj = await res.json();
  return resObj;
};

export const useCartQuery = () => {
  const { accessToken, locale, status } = useAuthContext();
  const { queryKey } = useWishlist();

  return useInfiniteQuery<DataResponse<Cart>>({
    queryKey: [queryKey],
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
      if (!lastPage?.data?.items?.length) return undefined;

      const lastProduct =
        lastPage.data.items[lastPage.data.items.length - 1];
      return lastProduct?._id || undefined;
    },
    initialPageParam: undefined,
    // staleTime: STALE_TIME,
    staleTime: 0,
    gcTime: GC_TIME,
    // KEY FIX: Only enable the query when session is loaded and we have an accessToken
    enabled: status !== "loading" && !!accessToken,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    // Optional: Retry configuration
    retry: (failureCount, error) => {
      // Don't retry if it's an auth error
      if (error.message.includes("access token")) {
        return false;
      }
      return failureCount < 3;
    },
  });
};
