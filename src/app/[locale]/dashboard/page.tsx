import AuthUserDashboard from "@/components/admin/layout/AuthUserDashboard";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AuthUserDashboard />;
    </HydrationBoundary>
  );
}
