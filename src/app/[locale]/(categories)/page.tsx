import CategoriesPageMainItems from "@/components/user/categories/CategoriesPageMainItems";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getActiveCategoriesQueryOptions } from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";

export default async function CategoriesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(getActiveCategoriesQueryOptions("en"));

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className="w-full">
      <HydrationBoundary state={dehydratedState}>
        <CategoriesPageMainItems />
      </HydrationBoundary>
    </div>
  );
}
