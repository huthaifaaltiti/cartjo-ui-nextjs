import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { Product } from "@/types/product.type";
import { getSearchProductsQueryOptions } from "@/hooks/react-query/query-options/publicSearchedProducts";
import { getSuggestedProductsQueryOptions } from "@/hooks/react-query/query-options/suggestedProducts";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import {
  fetchSearchProducts,
  fetchSuggestedProducts,
} from "../product.service";

export async function prefetchSearchData({
  queryClient,
  querySearch,
  typeHint,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
  querySearch?: string | undefined;
  typeHint?: string | undefined;
}) {
  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      getSearchProductsQueryOptions({
        locale: locale ?? Locale.EN,
        querySearch,
        typeHint,
        queryFn: () =>
          fetchSearchProducts({
            lang: locale ?? Locale.EN,
            querySearch,
            typeHint,
            fetcher: (path) =>
              apiFetch<DataListResponse<Product>>(path).then(
                ({ data, ok, status }) => {
                  if (!ok)
                    throw new Error(
                      `[SearchPage] Failed to fetch searched products: ${status}`,
                    );
                  return data;
                },
              ),
          }),
      }),
    ),

    queryClient.prefetchQuery(
      getSuggestedProductsQueryOptions({
        locale: locale ?? Locale.EN,
        limit: PAGINATION_LIMITS.OTHERS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS ?? 4,
        queryFn: () =>
          fetchSuggestedProducts({
            lang: locale ?? Locale.EN,
            limit: PAGINATION_LIMITS.OTHERS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS ?? 4,
            fetcher: (path) =>
              apiFetch<DataListResponse<Product>>(path).then(
                ({ data, ok, status }) => {
                  if (!ok)
                    throw new Error(
                      `[SearchPage] Failed to fetch suggested products: ${status}`,
                    );
                  return data;
                },
              ),
          }),
      }),
    ),
  ]);
}
