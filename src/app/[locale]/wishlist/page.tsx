import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { fetchWishlistItems } from "@/hooks/react-query/useWishlistQuery";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import WishlistPageWrapper from "@/components/user/wishlist/WishlistPageWrapper";
import WishlistItems from "@/components/user/wishlist/WishlistItems";

const getNextPageParam = (lastPage: DataResponse<Wishlist>) => {
  if (!lastPage?.data?.products?.length) return undefined;

  const lastProduct = lastPage.data.products.at(-1);
  return lastProduct?._id ?? undefined;
};

const getWishlistQueryOptions = (token: string) => ({
  queryKey: ["wishlistItems", ""],
  queryFn: () =>
    fetchWishlistItems({
      token,
      lang: "en",
      limit: PAGINATION_LIMITS.WISHLIST_ITEMS,
    }),
  getNextPageParam,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});

const Page = async () => {
  const token = await getAccessTokenFromServerSession();
  if (!token) throw new Error("No access token found");

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery<DataResponse<Wishlist>>(
    getWishlistQueryOptions(token)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <WishlistPageWrapper>
      <HydrationBoundary state={dehydratedState}>
        <WishlistItems />
      </HydrationBoundary>
    </WishlistPageWrapper>
  );
};

export default Page;
