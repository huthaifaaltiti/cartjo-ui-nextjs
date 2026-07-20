import TotalUsersPage from "@/components/admin/routes/users/totalUsers/TotalUsersPage";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { prefetchTotalUsers } from "@/services/prefetch/totalUsers";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();

  await prefetchTotalUsers({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TotalUsersPage />;
    </HydrationBoundary>
  );
}
