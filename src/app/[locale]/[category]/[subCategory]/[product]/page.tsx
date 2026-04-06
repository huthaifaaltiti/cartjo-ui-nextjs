import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import {
  getActiveCategoriesQueryOptions,
  getProductQueryOptions,
  getSearchProductCommentsQueryOptions,
} from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import ProductDetailsPage from "@/components/user/product/ProductDetailsPage";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Comment } from "@/types/comment.type";
import { PublicProductContextProvider } from "@/contexts/PublicProduct.context";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { getProductCommentsQueryOptions } from "@/hooks/react-query/useProductCommentsQuery";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { getSuggestedProductsQueryOptions } from "@/hooks/react-query/useSuggestedProductQuery";
import { SUGGESTED_PRODUCTS_LIMIT } from "@/config/product.config";

interface PageProps {
  params: Promise<{
    locale: Locale | string;
    category: string;
    subCategory: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { p_id } = await searchParams;

  const token = await getAccessTokenFromServerSession();

  const productId = p_id as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery<DataListResponse<Product>>(
    getSuggestedProductsQueryOptions(locale, SUGGESTED_PRODUCTS_LIMIT),
  );

  await queryClient.prefetchQuery<DataResponse<Product>>(
    getProductQueryOptions(locale, productId, token),
  );

  await queryClient.prefetchInfiniteQuery<DataListResponse<Comment>>(
    getSearchProductCommentsQueryOptions(locale, productId),
  );

  await queryClient.prefetchInfiniteQuery<DataListResponse<Comment>>(
    getProductCommentsQueryOptions(locale || LocaleEnum.EN, productId),
  );

  await queryClient.prefetchQuery(
    getActiveCategoriesQueryOptions(locale || LocaleEnum.EN),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LoggedUserWishlistProvider>
        <PublicProductContextProvider>
          <ProductDetailsPage productId={productId} />
        </PublicProductContextProvider>
      </LoggedUserWishlistProvider>
    </HydrationBoundary>
  );
}
