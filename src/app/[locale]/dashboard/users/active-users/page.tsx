import ActiveUsersPage from "@/components/admin/routes/users/activeUsers/ActiveUsersPage";
import { requireAuth } from "@/utils/authRedirect";
import { getQueryClient } from "@/utils/queryUtils";
import { prefetchDashboardActiveUsersData } from "@/services/prefetch/dashboard/users";
import { PageProps } from "@/types/common";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/tokens.server";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();
  await prefetchDashboardActiveUsersData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ActiveUsersPage />
    </HydrationBoundary>
  );
}
