import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getOrdersQueryOptions } from "@/hooks/react-query/query-options/admin-dashboard/orders";
import { fetchOrders } from "@/services/order.service";
import { Order } from "@/types/order.type";

export async function prefetchDashboardOrdersData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  await queryClient.prefetchInfiniteQuery(
    getOrdersQueryOptions({
      locale: locale ?? Locale.EN,
      searchQuery: "",
      amountMax: 0,
      amountMin: 0,
      paymentMethod: null,
      paymentStatus: null,
      deliveryStatus: null,
      createdAfter: "",
      createdBefore: "",
      queryFn: ({ pageParam }) =>
        fetchOrders({
          lang: locale ?? Locale.EN,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.ORDERS ?? 20,
          fetcher: (path) =>
            apiFetch<DataListResponse<Order>>(path).then(
              ({ data, ok, status }) => {
                if (!ok)
                  throw new Error(
                    `[DashboardOrdersPage] Failed to fetch dashboard orders: ${status}`,
                  );
                return data;
              },
            ),
        }),
    }),
  );
}
