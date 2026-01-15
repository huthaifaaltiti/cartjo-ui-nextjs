"use client";

import { memo, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import UserSignInLink from "./UserSignInLink";
import UserDashboardLink from "./admin/UserDashboardLink";
import UserAccountLinkMenu from "./UserAccountLinkMenu";
import UserWishlistAndCart from "./UserWishlistAndCart";
import { useUserContextQuery } from "@/hooks/react-query/useUserContextQuery";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { hydrateWishlistCounters } from "@/redux/slices/wishlist";
import { hydrateCartCounters } from "@/redux/slices/cart";

type ExtendedSession = Session & {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    canManage?: boolean;
  };
};

const UserMenu = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: sessionData, status } = useSession();
  const { data: userContextData } = useUserContextQuery();

  const { totalItemsCount } = useSelector((state: RootState) => state.cart);
  const { itemsCount } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    if (!userContextData?.isSuccess) return;

    const counters = userContextData.data?.counters;
    if (!counters) return;

    dispatch(hydrateCartCounters(counters.cartItemsCount));
    dispatch(hydrateWishlistCounters(counters.wishlistItemsCount));
  }, [userContextData?.isSuccess, dispatch]);

  const counters = useMemo(
    () => ({
      wishlistItemsCount: itemsCount,
      cartItemsCount: totalItemsCount,
    }),
    [itemsCount, totalItemsCount]
  );

  const session = sessionData as ExtendedSession | null;
  const canManage = session?.user?.canManage ?? false;

  if (status === "loading") return <UserSignInLink />;
  if (!session) return <UserSignInLink />;

  return (
    <div className="w-uto flex items-center gap-1">
      {canManage && <UserDashboardLink />}

      <div className="w-auto flex items-center gap-2">
        <UserAccountLinkMenu />
        <UserWishlistAndCart initialCounters={counters} />
      </div>
    </div>
  );
};

export default memo(UserMenu);
