import CategoriesPage from "@/components/admin/routes/categories/CategoriesPage";
import { prefetchAdminCategories } from "@/services/prefetch/categories";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchAdminCategories({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategoriesPage />;
    </HydrationBoundary>
  );
}
