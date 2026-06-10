import AuthUserDashboard from "@/components/admin/layout/AuthUserDashboard";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuthUserDashboard />;
    </HydrationBoundary>
  );
}
