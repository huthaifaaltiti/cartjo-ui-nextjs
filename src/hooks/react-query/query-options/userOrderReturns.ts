import { Locale } from "@/types/locale";
import { Order } from "@/types/order.type";
import { DataListResponse } from "@/types/service-response.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

export const USER_ORDER_RETURNS_QUERY_KEY = "userOrderReturns" as const;

export const getUserOrderReturnsQueryOptions = ({
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

  const getNextPageParam = (lastPage: DataListResponse<Order>) => {
    if (!lastPage?.data?.length) return undefined;
    const lastOrder = lastPage.data[lastPage.data.length - 1];
    return lastOrder?._id || undefined;
  };

  return {
    queryKey: [
      USER_ORDER_RETURNS_QUERY_KEY,
      locale,
      uid,
      normalizedSearch,
    ] as const,
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
