import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getCategoryProductsQueryOptions,
  getCategoryQueryOptions,
} from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import CategorySubCategoriesGrid from "@/components/user/category/CategorySubCategoriesGrid";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Category } from "@/types/category.type";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";
import CategoryItems from "@/components/user/category/CategoryItems";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";

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
  /* 
  Ah 👍 this is a Next.js App Router gotcha.
  The error:

    Error: Route "/[locale]/[category]" used `params.locale`. `params` should be awaited before using its properties.
    Error: Route "/[locale]/[category]" used `searchParams.c_id`. `searchParams` should be awaited before using its properties.


    happens because in Next.js 15+, params and searchParams in a server component page are now async APIs, not plain objects.
    They need to be awaited before accessing.
  */
  const categoryId = c_id as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery<DataResponse<Category>>(
    getCategoryQueryOptions(locale, categoryId)
  );

  await queryClient.prefetchInfiniteQuery<DataListResponse<Product>>(
    getCategoryProductsQueryOptions(locale, categoryId)
  );

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
