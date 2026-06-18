import LogosPage from "@/components/admin/routes/logos/LogosPage";
import { requireAuth } from "@/utils/authRedirect";
import { getAccessToken } from "@/lib/tokens.server";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { prefetchDashboardLogosData } from "@/services/prefetch/logos";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardLogosPage({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchDashboardLogosData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LogosPage />
    </HydrationBoundary>
  );
}
