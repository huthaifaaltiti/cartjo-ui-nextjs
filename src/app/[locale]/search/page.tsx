import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { Locale } from "@/types/locale";
import { LoggedUserWishlistProvider } from "@/contexts/LoggedUserWishList.context";
import SearchItems from "@/components/user/search/SearchItems";
import { HomeContextProvider } from "@/contexts/HomeContext";
import { prefetchSearchData } from "@/services/prefetch/search";

interface PageProps {
  params: Promise<{ locale: Locale | string; category: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { q, typeHint } = await searchParams;

  const querySearch = q as string;

  const queryClient = getQueryClient();

  await prefetchSearchData({ queryClient, locale, querySearch, typeHint });

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
