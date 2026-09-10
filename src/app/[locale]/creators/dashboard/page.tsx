import AnimatedCreatorDashboard from "@/components/creators/dashboard/AnimatedCreatorDashboard";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const CreatorsDashboardPage = async () => {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <AnimatedCreatorDashboard />
    </HydrationBoundary>
  );
};

export default CreatorsDashboardPage;
