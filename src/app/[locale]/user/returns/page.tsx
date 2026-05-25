import {
  dehydrate,
  HydrationBoundary,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { Locale } from "@/types/locale";
import UserOrderReturnsContainer from "@/components/user/returns/UserOrderReturnsContainer";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { getSession } from "@/lib/session.server";
import { CartJOSession } from "@/types/cartjoSession.type";
import { getUserOrderReturnsQueryOptions } from "@/hooks/react-query/query-options/userOrderReturns";
import { fetchUserOrderReturns } from "@/services/orderReturn.service";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { apiFetch } from "@/lib/api.server";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

interface PageProps {
  params: Promise<{
    locale: Locale | string;
  }>;
}

const UserOrdersReturnsPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);
  const session = (await getSession()) as CartJOSession | null;

  const uid = session?.id ?? null;

  const queryClient = getQueryClient();

  if (uid) {
    try {
      await queryClient.prefetchInfiniteQuery<DataListResponse<Order>>(
        getUserOrderReturnsQueryOptions({
          locale,
          uid,
          queryFn: (context: QueryFunctionContext) =>
            fetchUserOrderReturns({
              uid,
              lang: locale ?? LocaleEnum.EN,
              limit: PAGINATION_LIMITS.USER_VIEW.ORDER_RETURNS,
              lastId: context.pageParam as string | undefined,
              fetcher: (path) =>
                apiFetch<DataListResponse<Order>>(path).then(
                  ({ data, ok, status }) => {
                    if (!ok)
                      throw new Error(
                        `[UserOrderReturnsPage] Failed to fetch order returns: ${status}`,
                      );
                    return data;
                  },
                ),
            }),
        }),
      );
    } catch (e) {
      console.error("[UserOrderReturnsPage] prefetch failed:", e);
    }
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UserOrderReturnsContainer />
    </HydrationBoundary>
  );
};

export default UserOrdersReturnsPage;
