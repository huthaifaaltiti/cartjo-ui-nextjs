import { Locale } from "@/types/locale";
import { prefetchDashboardCreatorsVideosData } from "@/services/prefetch/creators/dashboard/creatorsVideo";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import CreatorsVideosPageContainer from "@/components/admin/routes/creatorsVideos/CreatorsVideosPageContainer";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchDashboardCreatorsVideosData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorsVideosPageContainer />
    </HydrationBoundary>
  );
};

export default Page;
