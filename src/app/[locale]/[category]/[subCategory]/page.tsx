import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getSubCategoryProductsQueryOptions } from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import { DataListResponse } from "@/types/service-response.type";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import SubCategoryItems from "@/components/user/subCategory/SubCategoryItems";

interface PageProps {
  params: Promise<{
    locale: Locale | string;
    category: string;
    subCategory: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubCategoryPage({
  params,
  searchParams,
}: PageProps) {
  const { locale } = await params;
  const { c_id, sc_id } = await searchParams;

  const categoryId = c_id as string;
  const subCategoryId = sc_id as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataListResponse<Product>>(
    getSubCategoryProductsQueryOptions(locale, categoryId, subCategoryId)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LoggedUserWishlistProvider>
        <SubCategoryItems
          categoryId={categoryId}
          subCategoryId={subCategoryId}
        />
      </LoggedUserWishlistProvider>
    </HydrationBoundary>
  );
}
