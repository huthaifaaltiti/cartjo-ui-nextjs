import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { Product } from "@/types/product.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getSubCategoryProductsQueryOptions } from "@/hooks/react-query/query-options/subCategoryProducts";
import { fetchSubCategoryProducts } from "../subCategory.service";

export async function prefetchSubCategoryData({
  queryClient,
  categoryId,
  subCategoryId,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
  categoryId: string;
  subCategoryId: string;
}) {
  await queryClient.prefetchInfiniteQuery(
    getSubCategoryProductsQueryOptions({
      locale: locale ?? Locale.EN,
      categoryId,
      subCategoryId,
      priceFrom: 0,
      priceTo: 0,
      ratingFrom: 0,
      createdFrom: "",
      createdTo: "",
      beforeNumOfDays: 0,
      queryFn: ({ pageParam }) =>
        fetchSubCategoryProducts({
          lang: locale ?? Locale.EN,
          categoryId,
          subCategoryId,
          lastId: pageParam as string,
          limit:
            PAGINATION_LIMITS.PUBLIC_VIEW.SUB_CATEGORY_PRODUCTS_ITEMS ?? 20,
          fetcher: async (path) => {
            {
              const { data, ok, status } =
                await apiFetch<DataListResponse<Product>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[SubCategoryPage] Failed to fetch sub-category products: ${status}`,
                );
              }
              return data;
            }
          },
        }),
    }),
  );
}
