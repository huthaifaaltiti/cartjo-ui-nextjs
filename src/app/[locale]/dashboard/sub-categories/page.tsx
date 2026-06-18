import SubCategoriesPage from "@/components/admin/routes/subCategories/SubCategoriesPage";
import { requireAuth } from "@/utils/authRedirect";
import { getAccessToken } from "@/lib/tokens.server";
import { prefetchDashboardSubCategories } from "@/services/prefetch/dashboard-subCategory";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchDashboardSubCategories({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SubCategoriesPage />;
    </HydrationBoundary>
  );
}
