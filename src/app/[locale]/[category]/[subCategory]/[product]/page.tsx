import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getProductQueryOptions } from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import ProductDetailsPage from "@/components/user/product/ProductDetailsPage";
import { DataResponse } from "@/types/service-response.type";

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

  const productId = p_id as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery<DataResponse<Product>>(
    getProductQueryOptions(locale, productId)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LoggedUserWishlistProvider>
        <ProductDetailsPage productId={productId} />
      </LoggedUserWishlistProvider>
    </HydrationBoundary>
  );
}
