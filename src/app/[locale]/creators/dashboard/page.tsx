import { Locale } from "@/types/locale";
import { prefetchDashboardCreatorsVideosData } from "@/services/prefetch/dashboard/creatorsVideo";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const CreatorsDashboardPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchDashboardCreatorsVideosData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full text-slate-100">CreatorsDashboardPage</div>
    </HydrationBoundary>
  );
};

export default CreatorsDashboardPage;
