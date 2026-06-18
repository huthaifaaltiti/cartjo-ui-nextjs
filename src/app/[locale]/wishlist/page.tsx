import {
  dehydrate,
  HydrationBoundary,
  QueryFunctionContext,
} from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import WishlistItems from "@/components/user/wishlist/WishlistItems";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { getWishlistQueryOptions } from "@/hooks/react-query/query-options/wishlist";
import { Locale } from "@/types/locale";
import { fetchWishlistItems } from "@/services/wishlist.service";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { apiFetch } from "@/lib/api.server";

interface PageProps {
  params: Promise<{ locale: Locale }>;
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataResponse<Wishlist>>(
    getWishlistQueryOptions({
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchWishlistItems({
          lang: locale,
          limit: PAGINATION_LIMITS.USER_VIEW.WISHLIST_ITEMS,
          lastId: context.pageParam as string | undefined,
          fetcher: async (path) => {
            {
              const { data, ok, status } =
                await apiFetch<DataResponse<Wishlist>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[WishlistPage] Failed to fetch wishlist items: ${status}`,
                );
              }
              return data;
            }
          },
        }),
    }),
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WishlistItems />
    </HydrationBoundary>
  );
};

export default Page;
