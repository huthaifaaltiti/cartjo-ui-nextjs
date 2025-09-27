import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getSearchProductsQueryOptions } from "@/utils/queryOptions";
import { getQueryClient } from "@/utils/queryUtils";
import { DataListResponse } from "@/types/service-response.type";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import SearchItems from "@/components/user/search/SearchItems";
import { HomeContextProvider } from "@/contexts/HomeContext";

interface PageProps {
  params: Promise<{ locale: Locale | string; category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q } = await searchParams;

  const querySearch = q as string;

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataListResponse<Product>>(
    getSearchProductsQueryOptions(locale, querySearch)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LoggedUserWishlistProvider>
        <HomeContextProvider>
          <SearchItems />
        </HomeContextProvider>
      </LoggedUserWishlistProvider>
    </HydrationBoundary>
  );
}
