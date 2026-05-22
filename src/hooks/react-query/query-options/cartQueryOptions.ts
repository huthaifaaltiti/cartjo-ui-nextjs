import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { fetchCartItems } from "../useCartQuery";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";

export const CART_QUERY_KEY = "cartItems" as const;

export const getCartQueryOptions = (
  locale: string | Locale,
  token?: string,
) => {
  return {
    queryKey: [CART_QUERY_KEY, token],
    queryFn: ({ pageParam }: { pageParam?: unknown }) =>
      fetchCartItems({
        token,
        lang: locale ?? "en",
        limit: PAGINATION_LIMITS.USER_VIEW.CART_ITEMS ?? 20,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
      }),
    getNextPageParam: (lastPage: DataResponse<Cart>) => {
      const items = lastPage?.data?.items;

      if (!items?.length) return undefined;
      if (items.length < (PAGINATION_LIMITS.USER_VIEW.CART_ITEMS ?? 20))
        return undefined;

      const lastItem = items[items.length - 1];
      return lastItem?._id;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
