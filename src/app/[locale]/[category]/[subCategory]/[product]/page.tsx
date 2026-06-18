import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { Locale } from "@/types/locale";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import ProductDetailsPage from "@/components/user/product/ProductDetailsPage";
import { PublicProductContextProvider } from "@/contexts/PublicProduct.context";
import { prefetchProductData } from "@/services/prefetch/product";
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

  await prefetchProductData({ queryClient, locale, productId });

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
