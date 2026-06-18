import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getProductsQueryOptions } from "@/hooks/react-query/query-options/products";
import { fetchProducts } from "../product.service";
import { Product } from "@/types/product.type";
import { ViewMode } from "@/enums/viewMode.enum";

export async function prefetchAdminProducts({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  const viewMode = ViewMode.ADMIN;

  await queryClient.prefetchInfiniteQuery(
    getProductsQueryOptions({
      locale: fallbackLocale,
      search: "",
      viewMode,
      queryFn: ({ pageParam }) =>
        fetchProducts({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.PRODUCTS,
          viewMode,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<Product>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedProducts] Failed to fetch products: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
