import {
  dehydrate,
  HydrationBoundary,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { Locale } from "@/types/locale";
import UserOrdersContainer from "@/components/user/orders/UserOrdersContainer";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { getSession } from "@/lib/session.server";
import { CartJOSession } from "@/types/cartjoSession.type";
import { getUserOrdersQueryOptions } from "@/hooks/react-query/query-options/userOrders";
import { fetchUserOrders } from "@/services/order.service";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";

interface PageProps {
  params: Promise<{ locale: Locale | string }>;
}

const UserOrdersPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);
  const session = (await getSession()) as CartJOSession | null;
  const uid = session?._id ?? null;

  const queryClient = getQueryClient();

  if (uid) {
    try {
      await queryClient.prefetchInfiniteQuery<DataListResponse<Order>>(
        getUserOrdersQueryOptions({
          locale,
          uid,
          queryFn: (context: QueryFunctionContext) =>
            fetchUserOrders({
              uid,
              lang: locale,
              limit: PAGINATION_LIMITS.USER_VIEW.ORDERS,
              lastId: context.pageParam as string | undefined,
              fetcher: async (path) => {
                const { data, ok, status } =
                  await apiFetch<DataListResponse<Order>>(path);

                if (!ok || !data) {
                  throw new Error(
                    `[UserOrdersPage] Failed to fetch orders: ${status}`,
                  );
                }
                return data;
              },
            }),
        }),
      );
    } catch (e) {
      console.error("[UserOrdersPage] prefetch failed:", e);
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserOrdersContainer />
    </HydrationBoundary>
  );
};

export default UserOrdersPage;
