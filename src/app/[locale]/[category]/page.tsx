import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getCategoryQueryOptions } from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import CategorySubCategoriesGrid from "@/components/user/category/CategorySubCategoriesGrid";

interface PageProps {
  params?: {
    locale: string;
    category: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ searchParams }: PageProps) {
  const categoryId = searchParams?.c_id as string;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(getCategoryQueryOptions("en", categoryId));

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategorySubCategoriesGrid categoryId={categoryId} />
    </HydrationBoundary>
  );
}
