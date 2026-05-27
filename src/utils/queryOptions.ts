import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { fetchOrders } from "@/hooks/react-query/useOrdersQuery";
import {
  fetchProduct,
  fetchProductComments,
} from "@/hooks/react-query/useProductQuery";
import { Cart } from "@/types/cart.type";
import { Comment } from "@/types/comment.type";
import { FetchError } from "@/types/common";
import { Locale } from "@/types/locale";
import { DataListResponse, DataResponse } from "@/types/service-response.type";

export const getProductQueryOptions = (
  locale: string | Locale,
  productId: string,
  token: string | null,
) => {
  return {
    queryKey: ["publicProduct", locale, productId, token],
    queryFn: () => fetchProduct({ lang: locale, productId, token }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!token || !!productId,
    retry: (failureCount: number, error: Error) => {
      const err = error as FetchError;
      if (err?.status === 404) return false;
      return failureCount < 2; // Only retry up to 2 times for other errors
    },
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  };
};

export const getSearchProductCommentsQueryOptions = (
  locale: string,
  productId: string,
) => {
  const getNextPageParam = (lastPage: DataListResponse<Comment>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: ["publicSearchProductComments", locale, productId],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      if (!productId) throw new Error("No productId is found");

      return fetchProductComments({
        lang: locale,
        limit: PAGINATION_LIMITS.PUBLIC_PRODUCT_COMMENTS_ITEMS,
        lastId: typeof pageParam === "string" ? pageParam : undefined,
        productId,
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
  };
};

export const getOrdersQueryOptions = (token: string) => {
  const getNextPageParam = (lastPage: DataResponse<Cart>) => {
    if (!lastPage?.data?.items?.length) return undefined;

    const lastProduct = lastPage.data.items.at(-1);
    return lastProduct?._id ?? undefined;
  };

  return {
    queryKey: ["orders"],
    queryFn: () =>
      fetchOrders({
        token,
        lang: "en",
        limit: PAGINATION_LIMITS.ORDERS,
      }),
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
