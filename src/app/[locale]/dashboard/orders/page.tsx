import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import OrdersPageContainer from "@/components/admin/routes/orders/OrdersPageContainer";
import { requireAuth } from "@/utils/authRedirect";
import { getAccessToken } from "@/lib/tokens.server";
import { Locale } from "@/enums/locale.enum";
import { prefetchDashboardOrdersData } from "@/services/prefetch/dashboard/orders";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function DashboardOrdersPage({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchDashboardOrdersData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <OrdersPageContainer />
    </HydrationBoundary>
  );
}
