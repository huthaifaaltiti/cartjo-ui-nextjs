import SubCategoriesPage from "@/components/admin/routes/subCategories/SubCategoriesPage";
import { prefetchDashboardSubCategories } from "@/services/prefetch/dashboard-subCategory";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const queryClient = getQueryClient();

  await prefetchDashboardSubCategories({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <SubCategoriesPage />;
    </HydrationBoundary>
  );
}
