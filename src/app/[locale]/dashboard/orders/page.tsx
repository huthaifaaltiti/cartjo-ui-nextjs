import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import OrdersPageContainer from "@/components/admin/routes/orders/OrdersPageContainer";
import { Locale } from "@/enums/locale.enum";
import { prefetchDashboardOrdersData } from "@/services/prefetch/dashboard/orders";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function DashboardOrdersPage({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();

  await prefetchDashboardOrdersData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <OrdersPageContainer />
    </HydrationBoundary>
  );
}
