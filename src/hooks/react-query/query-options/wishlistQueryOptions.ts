import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { fetchWishlistItems } from "../useWishlistQuery";
import { Wishlist } from "@/types/wishlist.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

export const getWishlistQueryOptions = (
  locale: string | Locale,
  token?: string,
) => {
  return {
    queryKey: ["wishlistItems", locale],
    queryFn: ({ pageParam }: { pageParam?: unknown }) =>
      fetchWishlistItems({
        token,
        lang: locale,
        limit: PAGINATION_LIMITS.USER_VIEW.WISHLIST_ITEMS ?? 20,
        lastId: typeof pageParam === "string" ? pageParam : undefined,
      }),
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
