import { Locale } from "@/types/locale";
import { Order } from "@/types/order.type";
import { DataListResponse } from "@/types/service-response.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

export const USER_ORDERS_QUERY_KEY = "userOrders" as const;

export const getUserOrdersQueryOptions = ({
  locale,
  uid,
  search,
  queryFn,
}: {
  locale: Locale | string;
  uid: string;
  search?: string;
  queryFn: (context: QueryFunctionContext) => Promise<DataListResponse<Order>>;
}) => {
  const normalizedSearch = search || undefined;

  return {
    queryKey: [USER_ORDERS_QUERY_KEY, locale, uid, normalizedSearch] as const,
    queryFn,
    getNextPageParam: (lastPage: DataListResponse<Order>) => {
      if (!lastPage?.data?.length) return undefined;
      return lastPage.data[lastPage.data.length - 1]?._id || undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
