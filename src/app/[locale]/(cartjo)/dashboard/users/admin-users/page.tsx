import AdminUsersPage from "@/components/admin/routes/users/adminUsers/AdminUsersPage";
import { requireAuth } from "@/utils/authRedirect";
import { getQueryClient } from "@/utils/queryUtils";
import { PageProps } from "@/types/common";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/tokens.server";
import { prefetchAdminUsers } from "@/services/prefetch/adminUsers";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();
  await prefetchAdminUsers({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AdminUsersPage />
    </HydrationBoundary>
  );
}
