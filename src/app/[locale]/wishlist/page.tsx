import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import WishlistItems from "@/components/user/wishlist/WishlistItems";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { getWishlistQueryOptions } from "@/hooks/react-query/query-options/wishlist";

const Page = async () => {
  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();
  if (token) {
    await queryClient.prefetchInfiniteQuery<DataResponse<Wishlist>>(
      getWishlistQueryOptions(token),
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WishlistItems />
    </HydrationBoundary>
  );
};

export default Page;
