"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { getCartQueryOptions } from "./query-options/cartQueryOptions";
import { fetcher } from "@/utils/fetcher";
import { authFetcher } from "@/utils/authFetcher";

interface FetchCartItemsParams {
  token?: string | null;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchCartItems = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.USER_VIEW.CART_ITEMS ?? 20,
  lastId,
}: FetchCartItemsParams): Promise<DataResponse<Cart>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.CART.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);

  if (token) {
    return fetcher<DataResponse<Cart>>(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }

  return authFetcher<DataResponse<Cart>>(url.toString());
};

export const useCartQuery = (token?: string) => {
  const { locale, isSessionLoading, isAuthenticated } = useAuthContext();

  return useInfiniteQuery<DataResponse<Cart>>({
    ...getCartQueryOptions(locale, token),
    enabled: !isSessionLoading && isAuthenticated,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      if (error?.status === 401 || error?.status === 403) return false;
      return failureCount < 3;
    },
  });
};
