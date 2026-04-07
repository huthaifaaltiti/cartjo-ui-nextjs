import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { CART_QUERY_KEY, fetchCartItems } from "../useCartQuery";

export const getCartQueryOptions = (token: string) => {
  return {
    queryKey: [CART_QUERY_KEY, token],
    queryFn: ({ pageParam }: { pageParam?: unknown }) =>
      fetchCartItems({
        token,
        lang: "en",
        limit: PAGINATION_LIMITS.CART_ITEMS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
      }),
    getNextPageParam: (lastPage: DataResponse<Cart>) => {
      const items = lastPage?.data?.items;

      if (!items?.length) return undefined;
      if (items.length < PAGINATION_LIMITS.CART_ITEMS) return undefined;

      const lastItem = items[items.length - 1];
      return lastItem?._id;
    },
    initialPageParam: undefined,
  };
};
