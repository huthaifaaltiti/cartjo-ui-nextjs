import TypeHintConfigsPage from "@/components/admin/routes/typeHintConfigs/TypeHintConfigsPage";
import { PageProps } from "@/types/common";
import { getQueryClient } from "@/utils/queryUtils";
import { prefetchDashboardTypeHintConfigsData } from "@/services/prefetch/dashboard/typeHintConfigs";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const queryClient = getQueryClient();

  await prefetchDashboardTypeHintConfigsData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <TypeHintConfigsPage />
    </HydrationBoundary>
  );
};

export default Page;
