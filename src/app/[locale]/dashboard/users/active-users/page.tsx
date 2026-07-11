import ActiveUsersPage from "@/components/admin/routes/users/activeUsers/ActiveUsersPage";
import { getQueryClient } from "@/utils/queryUtils";
import { PageProps } from "@/types/common";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { prefetchActiveUsers } from "@/services/prefetch/activeUsers";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchActiveUsers({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ActiveUsersPage />
    </HydrationBoundary>
  );
}
