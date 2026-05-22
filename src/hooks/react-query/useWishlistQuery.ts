"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { authFetcher } from "@/utils/authFetcher";
import { fetcher } from "@/utils/fetcher";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getWishlistQueryOptions } from "./query-options/wishlistQueryOptions";
interface FetchWishlistItemsParams {
  token?: string | null;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
}

export const fetchWishlistItems = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.USER_VIEW.WISHLIST_ITEMS ?? 20,
  lastId,
}: FetchWishlistItemsParams): Promise<DataResponse<Wishlist>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.WISHLIST.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);

  if (token) {
    return fetcher<DataResponse<Wishlist>>(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }

  return authFetcher<DataResponse<Wishlist>>(url.toString());
};

export const useWishlistQuery = (token?: string) => {
  const { isAuthenticated, locale, isSessionLoading } = useAuthContext();

  return useInfiniteQuery<DataResponse<Wishlist>>({
    ...getWishlistQueryOptions(locale, token),
    enabled: !isSessionLoading && isAuthenticated,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
