import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Wishlist } from "@/types/wishlist.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { QueryFunctionContext } from "@tanstack/react-query";

export const WISHLIST_QUERY_KEY = "wishlistItems" as const;

export const getWishlistQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (context: QueryFunctionContext) => Promise<DataResponse<Wishlist>>;
}) => {
  return {
    queryKey: [WISHLIST_QUERY_KEY, locale],
    queryFn,
    getNextPageParam: (lastPage: DataResponse<Wishlist>) => {
      if (!lastPage?.data?.products?.length) return undefined;
      const lastProduct = lastPage.data.products.at(-1);
      return lastProduct?._id ?? undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
