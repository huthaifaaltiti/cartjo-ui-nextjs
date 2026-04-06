import React from "react";
import { redirect } from "next/navigation";
import PaymentCheckoutPageClient from "@/components/user/checkout/PaymentCheckoutPageClient";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { getQueryClient } from "@/utils/queryUtils";
import { DataResponse } from "@/types/service-response.type";
import { Cart } from "@/types/cart.type";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { WishlistContextProvider } from "@/contexts/Wishlist.context";
import { getCartQueryOptions } from "@/hooks/react-query/useCartQuery";

const PaymentCheckoutPage: React.FC = async () => {
  const token = await getAccessTokenFromServerSession();

  if (!token) redirect("/auth");

  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery<DataResponse<Cart>>(
    getCartQueryOptions(token)
  );

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <WishlistContextProvider>
        <PaymentCheckoutPageClient />;
      </WishlistContextProvider>
    </HydrationBoundary>
  );
};

export default PaymentCheckoutPage;
