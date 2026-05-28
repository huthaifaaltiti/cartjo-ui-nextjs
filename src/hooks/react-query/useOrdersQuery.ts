import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";
import { getOrdersQueryOptions } from "./query-options/admin-dashboard/orders";
import { useAuthContext } from "../useAuthContext";
import { fetchOrders } from "@/services/order.service";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { authFetcher } from "@/utils/authFetcher";

export const useOrdersQuery = ({
  searchQuery,
  amountMin,
  amountMax,
  paymentMethod,
  paymentStatus,
  deliveryStatus,
  createdAfter,
  createdBefore,
}: {
  searchQuery: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: PaymentMethods;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: OrderDeliveryStatus;
  createdAfter?: string;
  createdBefore?: string;
}) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Order>>({
    ...getOrdersQueryOptions({
      locale,
      searchQuery,
      amountMax,
      amountMin,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      createdAfter,
      createdBefore,
      queryFn: (context: QueryFunctionContext) =>
        fetchOrders({
          lang: locale,
          lastId: context.pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.ORDERS ?? 20,
          search: searchQuery,
          amountMax,
          amountMin,
          paymentMethod,
          paymentStatus,
          deliveryStatus,
          createdAfter,
          createdBefore,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
