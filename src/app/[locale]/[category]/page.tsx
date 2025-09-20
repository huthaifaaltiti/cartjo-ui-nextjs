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
  params: {
    locale: Locale | string;
    category: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = params;

  const categoryId = searchParams?.c_id as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery<DataResponse<Category>>(
    getCategoryQueryOptions("en", categoryId)
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
