import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import CartItems from "@/components/user/cart/CartItems";
import { getCartQueryOptions } from "@/utils/queryOptions";
import { Cart } from "@/types/cart.type";
import { redirect } from "next/navigation";

const Page = async () => {
  const token = await getAccessTokenFromServerSession();

  if (!token) redirect("/auth");

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataResponse<Cart>>(
    getCartQueryOptions(token)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CartItems />
    </HydrationBoundary>
  );
};

export default Page;
