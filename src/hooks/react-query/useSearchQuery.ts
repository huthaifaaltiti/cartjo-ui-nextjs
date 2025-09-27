import { useInfiniteQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";
import { fetcher } from "@/utils/fetcher";

interface FetchSearchProductsParams {
  querySearch: string;
  lang?: string | Locale;
  categoryId?: string | undefined;
  subCategoryId?: string | undefined;
  limit?: number;
  lastId?: string;
  priceFrom?: number;
  priceTo?: number;
  ratingFrom?: number;
  createdFrom?: string;
  createdTo?: string;
  beforeNumOfDays?: number;
}

export const fetchSearchProducts = async ({
  querySearch,
  lang = "en",
  categoryId,
  subCategoryId,
  limit = PAGINATION_LIMITS.PUBLIC_SUB_CATEGORY_PRODUCTS_ITEMS,
  lastId,
  priceFrom,
  priceTo,
  ratingFrom,
  createdFrom,
  createdTo,
  beforeNumOfDays,
}: FetchSearchProductsParams): Promise<DataListResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.SEARCH.PRODUCTS}`);

  if (querySearch) url.searchParams.append("q", querySearch);
  if (lang) url.searchParams.append("lang", lang);
  if (categoryId) url.searchParams.append("categoryId", categoryId);
  if (subCategoryId) url.searchParams.append("subCategoryId", subCategoryId);
  if (limit) url.searchParams.append("limit", String(limit));
  if (lastId) url.searchParams.append("lastId", lastId);
  if (priceFrom !== undefined && priceFrom > 0)
    url.searchParams.append("priceFrom", String(priceFrom));
  if (priceTo !== undefined && priceTo > 0)
    url.searchParams.append("priceTo", String(priceTo));
  if (ratingFrom !== undefined && ratingFrom > 0)
    url.searchParams.append("ratingFrom", String(ratingFrom));
  if (createdFrom !== undefined && createdFrom)
    url.searchParams.append("createdFrom", String(createdFrom));
  if (createdTo !== undefined && createdTo)
    url.searchParams.append("createdTo", String(createdTo));
  if (beforeNumOfDays !== undefined && beforeNumOfDays > 0)
    url.searchParams.append("beforeNumOfDays", String(beforeNumOfDays));

  const resp = await fetcher<DataListResponse<Product>>(url, {});

  return resp;
};

export const useSearchProductsQuery = (
  querySearch: string,
  categoryId?: string,
  subCategoryId?: string,
  priceFrom?: number,
  priceTo?: number,
  ratingFrom?: number,
  createdFrom?: string,
  createdTo?: string,
  beforeNumOfDays?: number
) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    queryKey: [
      "publicSearchProducts",
      locale,
      querySearch,
      categoryId,
      subCategoryId,
      priceFrom,
      priceTo,
      ratingFrom,
      createdFrom,
      createdTo,
      beforeNumOfDays,
    ],
    queryFn: ({ pageParam }) => {
      if (!querySearch) throw new Error("No search text is found");

      return fetchSearchProducts({
        querySearch,
        lang: locale,
        categoryId,
        subCategoryId,
        limit: PAGINATION_LIMITS.PUBLIC_SEARCH_PRODUCTS_ITEMS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
        priceFrom,
        priceTo,
        ratingFrom,
        createdFrom,
        createdTo,
        beforeNumOfDays,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.length) return undefined;

      const lastProduct = lastPage.data[lastPage.data.length - 1];
      return lastProduct?._id || undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!querySearch,
  });
};
