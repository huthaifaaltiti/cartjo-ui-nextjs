import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getOrdersQueryOptions } from "@/hooks/react-query/query-options/orders";
import { fetchOrders } from "@/services/order.service";
import { Order } from "@/types/order.type";

export async function prefetchDashboardOrdersData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getOrdersQueryOptions({
      locale: fallbackLocale,
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
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.ORDERS ?? 20,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<Order>>(path);

            if (!ok || !data) {
              throw new Error(
                `[DashboardOrdersPage] Failed to fetch dashboard orders: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
