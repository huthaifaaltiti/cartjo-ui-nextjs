import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { FetchPaginatedArgs, ViewMode } from "@/types/common";
import { Product } from "@/types/product.type";
import { DataListResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";
import { useAuthContext } from "../useAuthContext";
import { getCategoriesPicksQueryOptions } from "./query-options/categoryPicks";
import { fetchCategoriesPicks } from "@/services/category.service";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { authFetcher } from "@/utils/authFetcher";

export const fetchProducts = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.PRODUCTS,
  lastId,
  search,
  viewMode,
}: FetchPaginatedArgs & { viewMode?: ViewMode }): Promise<
  DataListResponse<Product>
> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.PRODUCTS.ALL);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (lastId) url.searchParams.append("lastId", lastId.toString());
  if (search) url.searchParams.append("search", search.toString());
  if (viewMode) url.searchParams.append("viewMode", viewMode);

  const resp = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!resp.ok) throw new Error("Could not retrieve products");

  const respObj = await resp.json();

  return respObj;
};

export const useProductsQuery = ({
  search,
  viewMode,
}: {
  search?: string;
  viewMode?: ViewMode;
}) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Product>>({
    queryKey: ["products", search, viewMode],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchProducts({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.PRODUCTS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,

        search,
        viewMode,
      });
    },
    getNextPageParam: (lastPage) => {
      const items = lastPage?.data;

      if (!items?.length) return undefined;

      if (items.length < PAGINATION_LIMITS.PRODUCTS) return undefined;

      if (items && items.length > 0) {
        const lastItem = items[items.length - 1];
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

export const useCategoriesPicksQuery = (categoryId: string) => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getCategoriesPicksQueryOptions({
      locale: locale ?? LocaleEnum.EN,
      categoryId,
      queryFn: () =>
        fetchCategoriesPicks({
          lang: locale ?? LocaleEnum.EN,
          categoryId,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: true
  });
};
