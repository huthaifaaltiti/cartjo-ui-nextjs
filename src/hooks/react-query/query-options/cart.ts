import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";

export const CART_QUERY_KEY = "cartItems" as const;

export const getCartQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (context: QueryFunctionContext) => Promise<DataResponse<Cart>>;
}) => {
  return {
    queryKey: [CART_QUERY_KEY, locale],
    queryFn,
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
