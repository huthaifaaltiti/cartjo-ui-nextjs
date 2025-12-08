import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import WishlistItems from "@/components/user/wishlist/WishlistItems";
import { getWishlistQueryOptions } from "@/utils/queryOptions";
import { redirect } from "next/navigation";

const Page = async () => {
  const token = await getAccessTokenFromServerSession();
  if (!token) redirect('/auth');

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery<DataResponse<Wishlist>>(
    getWishlistQueryOptions(token)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WishlistItems />
    </HydrationBoundary>
  );
};

export default Page;
