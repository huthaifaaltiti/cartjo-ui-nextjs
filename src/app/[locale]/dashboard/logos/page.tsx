import LogosPage from "@/components/admin/routes/logos/LogosPage";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { prefetchDashboardLogosData } from "@/services/prefetch/logos";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardLogosPage({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();

  await prefetchDashboardLogosData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LogosPage />
    </HydrationBoundary>
  );
}
