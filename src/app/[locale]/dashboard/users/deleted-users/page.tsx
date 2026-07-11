import DeletedUsersPage from "@/components/admin/routes/users/deletedUsers/DeletedUsersPage";
import { getQueryClient } from "@/utils/queryUtils";
import { PageProps } from "@/types/common";
import { prefetchDeletedUsers } from "@/services/prefetch/deletedUsers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchDeletedUsers({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DeletedUsersPage />;
    </HydrationBoundary>
  );
}
