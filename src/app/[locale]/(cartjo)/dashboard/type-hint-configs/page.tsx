import TypeHintConfigsPage from "@/components/admin/routes/typeHintConfigs/TypeHintConfigsPage";
import { requireAuth } from "@/utils/authRedirect";
import { PageProps } from "@/types/common";
import { getAccessToken } from "@/lib/tokens.server";
import { getQueryClient } from "@/utils/queryUtils";
import { prefetchDashboardTypeHintConfigsData } from "@/services/prefetch/dashboard/typeHintConfigs";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

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
