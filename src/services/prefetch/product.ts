import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { Product } from "@/types/product.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { fetchProduct, fetchSuggestedProducts } from "../product.service";
import { getSuggestedProductsQueryOptions } from "@/hooks/react-query/query-options/suggestedProducts";
import { getProductQueryOptions } from "@/hooks/react-query/query-options/product";
import { getSearchProductCommentsQueryOptions } from "@/hooks/react-query/query-options/searchProductComments";
import { fetchProductComments } from "../comment.service";
import { Comment } from "@/types/comment.type";
import { getProductCommentsQueryOptions } from "@/hooks/react-query/query-options/productComments";
import { getActiveCategoriesQueryOptions } from "@/hooks/react-query/query-options/activeCategories";
import { fetchActiveCategories } from "../category.service";
import { Category } from "@/types/category.type";

export async function prefetchProductData({
  queryClient,
  productId,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
  productId: string;
}) {
  await Promise.all([
    queryClient.prefetchQuery(
      getSuggestedProductsQueryOptions({
        locale: locale ?? Locale.EN,
        limit: PAGINATION_LIMITS.OTHERS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS ?? 4,
        productId,
        queryFn: () =>
          fetchSuggestedProducts({
            lang: locale ?? Locale.EN,
            limit:
              PAGINATION_LIMITS.OTHERS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS ?? 4,
            productId,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataListResponse<Product>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[ProductPage] Failed to fetch suggested products: ${status}`,
                );
              }
              return data;
            },
          }),
      }),
    ),
    queryClient.prefetchQuery(
      getProductQueryOptions({
        locale: locale ?? Locale.EN,
        productId,
        queryFn: () =>
          fetchProduct({
            lang: locale ?? Locale.EN,
            productId,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataResponse<Product>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[ProductPage] Failed to fetch product: ${status}, productID: ${productId}`,
                );
              }
              return data;
            },
          }),
      }),
    ),
    queryClient.prefetchInfiniteQuery(
      getSearchProductCommentsQueryOptions({
        locale: locale ?? Locale.EN,
        productId,
        queryFn: ({ pageParam }) =>
          fetchProductComments({
            lang: locale ?? Locale.EN,
            productId,
            lastId: pageParam as string,
            limit: PAGINATION_LIMITS.PUBLIC_VIEW.PRODUCT_COMMENTS ?? 20,
            fetcher: async (path) => {
              {
                const { data, ok, status } =
                  await apiFetch<DataListResponse<Comment>>(path);

                if (!ok || !data) {
                  throw new Error(
                    `[ProductPage] Failed to fetch search product comments: ${status}`,
                  );
                }
                return data;
              }
            },
          }),
      }),
    ),
    queryClient.prefetchInfiniteQuery(
      getProductCommentsQueryOptions({
        locale: locale ?? Locale.EN,
        productId,
        queryFn: ({ pageParam }) =>
          fetchProductComments({
            lang: locale ?? Locale.EN,
            productId,
            lastId: pageParam as string,
            limit: PAGINATION_LIMITS.PUBLIC_VIEW.PRODUCT_COMMENTS ?? 20,
            fetcher: async (path) => {
              {
                const { data, ok, status } =
                  await apiFetch<DataListResponse<Comment>>(path);

                if (!ok || !data) {
                  throw new Error(
                    `[ProductPage] Failed to fetch product comments: ${status}`,
                  );
                }
                return data;
              }
            },
          }),
      }),
    ),
    queryClient.fetchQuery(
      getActiveCategoriesQueryOptions({
        locale: locale ?? Locale.EN,
        queryFn: () =>
          fetchActiveCategories({
            lang: locale ?? Locale.EN,
            fetcher: async (path) => {
              {
                const { data, ok, status } =
                  await apiFetch<DataListResponse<Category>>(path);

                if (!ok || !data) {
                  throw new Error(
                    `[ProductPage] Failed to fetch active categories: ${status}`,
                  );
                }
                return data;
              }
            },
          }),
      }),
    ),
  ]);
}
