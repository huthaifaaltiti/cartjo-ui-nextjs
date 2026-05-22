import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import CartItems from "@/components/user/cart/CartItems";
import { Cart } from "@/types/cart.type";
import { getCartQueryOptions } from "@/hooks/react-query/query-options/cartQueryOptions";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";

const Page = async () => {
  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();
  if (token) {
    await queryClient.prefetchInfiniteQuery<DataResponse<Cart>>(
      getCartQueryOptions(token),
    );
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CartItems />
    </HydrationBoundary>
  );
};

export default Page;
