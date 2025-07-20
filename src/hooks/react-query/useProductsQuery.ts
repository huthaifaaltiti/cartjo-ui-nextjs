import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

import { CommonListResponse, FetchPaginatedArgs } from "@/types/common";
import { Product } from "@/types/product.type";

import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";

export const fetchProducts = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.TOTAL_USERS_LIMIT,
  lastId,
  search,
}: FetchPaginatedArgs): Promise<CommonListResponse<Product>> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.PRODUCTS.ALL);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (lastId) url.searchParams.append("lastId", lastId.toString());
  if (search) url.searchParams.append("search", search.toString());

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) throw new Error("Could not retrieve products");

  const respObj = await resp.json();

  return respObj;
};

export const useProductsQuery = ({ search }: { search?: string }) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<CommonListResponse<Product>>({
    queryKey: ["products", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchProducts({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.TOTAL_PRODUCTS_LIMIT,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,

        search,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data && lastPage.data.length > 0) {
        const lastItem = lastPage.data[lastPage.data.length - 1];
        return lastItem._id;
      }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
