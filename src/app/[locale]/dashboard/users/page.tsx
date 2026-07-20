import UsersPageContainer from "@/components/admin/routes/users/UsersPageContainer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { prefetchDashboardUsersData } from "@/services/prefetch/dashboard/users";

export default async function UsersPage({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchDashboardUsersData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <UsersPageContainer />
    </HydrationBoundary>
  );
}
