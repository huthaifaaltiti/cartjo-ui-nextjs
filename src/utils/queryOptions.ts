import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { fetchOrders } from "@/hooks/react-query/useOrdersQuery";
import { Cart } from "@/types/cart.type";
import { DataResponse } from "@/types/service-response.type";

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
