import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataListResponse } from "@/types/service-response.type";
import { getOrdersQueryOptions } from "@/utils/queryOptions";
import { Order } from "@/types/order.type";
import OrdersPageContainer from "@/components/admin/routes/orders/OrdersPageContainer";
import { requireAuth } from "@/utils/authRedirect";

export default async function DashboardOrdersPage() {
  const token = await getAccessTokenFromServerSession();
  requireAuth(token)

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataListResponse<Order>>(
    getOrdersQueryOptions(token!)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <OrdersPageContainer />
    </HydrationBoundary>
  );
}
