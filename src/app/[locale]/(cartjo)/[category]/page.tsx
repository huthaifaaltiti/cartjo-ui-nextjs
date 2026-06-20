import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import CategorySubCategoriesGrid from "@/components/user/category/CategorySubCategoriesGrid";
import { Locale } from "@/types/locale";
import CategoryItems from "@/components/user/category/CategoryItems";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import { prefetchCategoryData } from "@/services/prefetch/category";

interface PageProps {
  params: Promise<{ locale: Locale | string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { c_id } = await searchParams;

  const categoryId = c_id as string;

  const queryClient = getQueryClient();

  await prefetchCategoryData({ locale, queryClient, categoryId });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CategorySubCategoriesGrid categoryId={categoryId} />
      <LoggedUserWishlistProvider>
        <CategoryItems categoryId={categoryId} />
      </LoggedUserWishlistProvider>
    </HydrationBoundary>
  );
}
