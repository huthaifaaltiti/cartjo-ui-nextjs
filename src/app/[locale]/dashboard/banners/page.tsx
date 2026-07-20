import { Locale } from "@/types/locale";
import { prefetchDashboardBannersData } from "@/services/prefetch/dashboard/banners";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import BannersPageContainer from "@/components/admin/routes/banners/BannersPageContainer";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchDashboardBannersData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BannersPageContainer />
    </HydrationBoundary>
  );
};

export default Page;
