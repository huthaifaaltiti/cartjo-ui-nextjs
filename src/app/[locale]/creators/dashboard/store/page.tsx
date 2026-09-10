import { Locale } from "@/types/locale";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { prefetchCreatorStoreData } from "@/services/prefetch/creators/creatorStore";
import CreatorsDashboardPageContainer from "@/components/creators/dashboard/CreatorsDashboardPageContainer";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const CreatorStoreDashboardPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const queryClient = getQueryClient();
  await prefetchCreatorStoreData({ queryClient, locale }).catch((e) =>
    console.error("[prefetchCreatorStoreData]", e),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorsDashboardPageContainer locale={locale} />
    </HydrationBoundary>
  );
};

export default CreatorStoreDashboardPage;
