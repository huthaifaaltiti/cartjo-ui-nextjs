import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { Order } from "@/types/order.type";
import { QueryFunctionContext } from "@tanstack/react-query";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";

export const DASHBOARD_BANNERS_KEY = "orders" as const;

interface OrdersParams {
  locale: string | Locale;
  searchQuery: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: PaymentMethods | null;
  paymentStatus?: PaymentStatus | null;
  deliveryStatus?: OrderDeliveryStatus | null;
  createdAfter?: string;
  createdBefore?: string;
  queryFn: (context: QueryFunctionContext) => Promise<DataListResponse<Order>>;
}

export const getOrdersQueryOptions = (params: OrdersParams) => {
  const { queryFn, ...filters } = params;

  const getNextPageParam = (lastPage: DataListResponse<Order>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  };

  return {
    queryKey: [DASHBOARD_BANNERS_KEY, filters],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
