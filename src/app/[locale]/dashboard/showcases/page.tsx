import ShowcasesPage from "@/components/admin/routes/showcases/ShowcasesPage";
import { requireAuth } from "@/utils/authRedirect";
import { prefetchDashboardShowcasesData } from "@/services/prefetch/dashboard/showcases";
import { getQueryClient } from "@/utils/queryUtils";
import { PageProps } from "@/types/common";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessToken } from "@/lib/tokens.server";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchDashboardShowcasesData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ShowcasesPage />;
    </HydrationBoundary>
  );
};

export default Page;
