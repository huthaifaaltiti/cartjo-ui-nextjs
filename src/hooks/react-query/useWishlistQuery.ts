// useWishlistQuery.ts
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { Locale } from "@/types/locale";
import { useWishlist } from "@/contexts/Wishlist.context";

interface FetchWishlistItemsParams {
  token: string | null;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchWishlistItems = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.WISHLIST_ITEMS,
  lastId,
  search,
}: FetchWishlistItemsParams): Promise<DataResponse<Wishlist>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.WISHLIST.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  handleUnauthorizedResponse(res, lang);

  if (!res.ok) throw new Error("Could not retrieve active wishlist list");

  const resObj = await res.json();
  return resObj;
};

export const useWishlistQuery = ({ search }: { search: string }) => {
  const { accessToken, locale, status } = useAuthContext();
  const { queryKey } = useWishlist();

  return useInfiniteQuery<DataResponse<Wishlist>>({
    queryKey: [queryKey, search],
    queryFn: ({ pageParam }) => {
      // This should never be reached due to enabled condition, but keeping as safeguard
      if (!accessToken) {
        throw new Error("No access token found");
      }

      return fetchWishlistItems({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.WISHLIST_ITEMS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
        search,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.products?.length) return undefined;

      const lastProduct =
        lastPage.data.products[lastPage.data.products.length - 1];
      return lastProduct?._id || undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    // KEY FIX: Only enable the query when session is loaded and we have an accessToken
    enabled: status !== "loading" && !!accessToken,
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
