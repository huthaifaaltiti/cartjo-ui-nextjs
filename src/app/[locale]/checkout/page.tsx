import React from "react";
import PaymentCheckoutPageClient from "@/components/user/checkout/PaymentCheckoutPageClient";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { WishlistContextProvider } from "@/contexts/Wishlist.context";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";
import { prefetchCartData } from "@/services/prefetch/cart";
import { PageProps } from "@/types/common";

const PaymentCheckoutPage = async ({ params }: PageProps) => {
  const { locale } = await params;

  const token = await getAccessToken();
  requireAuth(token);

  const queryClient = getQueryClient();

  await prefetchCartData({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <WishlistContextProvider>
        <PaymentCheckoutPageClient />
      </WishlistContextProvider>
    </HydrationBoundary>
  );
};

export default PaymentCheckoutPage;
