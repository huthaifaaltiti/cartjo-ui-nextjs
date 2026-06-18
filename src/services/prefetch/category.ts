import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { Product } from "@/types/product.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getCategoryQueryOptions } from "@/hooks/react-query/query-options/category";
import { fetchCategory, fetchCategoryProducts } from "../category.service";
import { Category } from "@/types/category.type";
import { getCategoryProductsQueryOptions } from "@/hooks/react-query/query-options/categoryProducts";

export async function prefetchCategoryData({
  queryClient,
  categoryId,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
  categoryId: string;
}) {
  await Promise.all([
    queryClient.prefetchQuery(
      getCategoryQueryOptions({
        locale: locale ?? Locale.EN,
        categoryId,
        queryFn: () =>
          fetchCategory({
            lang: locale ?? Locale.EN,
            categoryId,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataResponse<Category>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[CategoryPage] Failed to fetch category: ${status}`,
                );
              }
              return data;
            },
          }),
      }),
    ),

    queryClient.prefetchInfiniteQuery(
      getCategoryProductsQueryOptions({
        locale: locale ?? Locale.EN,
        categoryId,
        priceFrom: 0,
        priceTo: 0,
        ratingFrom: 0,
        createdFrom: "",
        createdTo: "",
        beforeNumOfDays: 0,
        queryFn: ({ pageParam }) =>
          fetchCategoryProducts({
            lang: locale ?? Locale.EN,
            categoryId,
            lastId: pageParam as string,
            limit: PAGINATION_LIMITS.PUBLIC_VIEW.CATEGORY_PRODUCTS_ITEMS ?? 20,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataListResponse<Product>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[CategoryPage] Failed to fetch category products: ${status}`,
                );
              }
              return data;
            },
          }),
      }),
    ),
  ]);
}
