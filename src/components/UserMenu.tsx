"use client";

import { memo, useEffect, useMemo } from "react";
import UserSignInLink from "./UserSignInLink";
import UserDashboardLink from "./admin/UserDashboardLink";
import UserAccountLinkMenu from "./UserAccountLinkMenu";
import UserWishlistAndCart from "./UserWishlistAndCart";
import { useUserContextQuery } from "@/hooks/react-query/useUserContextQuery";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { hydrateWishlistCounters } from "@/redux/slices/wishlist";
import { hydrateCartCounters } from "@/redux/slices/cart";
import isAdminClientSide from "@/utils/isAdminClientSide.util";

const UserMenu = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: userContextData } = useUserContextQuery();

  const { session, loading } = useSelector(
    (state: RootState) => state.authentication,
  );
  const { totalItemsCount } = useSelector((state: RootState) => state.cart);
  const { itemsCount } = useSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    if (userContextData?.isSuccess && userContextData.data?.counters) {
      const { cartItemsCount, wishlistItemsCount } =
        userContextData.data.counters;
      dispatch(hydrateCartCounters(cartItemsCount));
      dispatch(hydrateWishlistCounters(wishlistItemsCount));
    }
  }, [userContextData, dispatch]);
  
  const counters = useMemo(() => {
    const qCart = userContextData?.data?.counters?.cartItemsCount ?? 0;
    const qWish = userContextData?.data?.counters?.wishlistItemsCount ?? 0;

    return {
      wishlistItemsCount: itemsCount || qWish,
      cartItemsCount: totalItemsCount || qCart,
    };
  }, [itemsCount, totalItemsCount, userContextData]);

  const canManage = isAdminClientSide(session) ?? false;

  if (loading && !session) return <UserSignInLink />;
  if (!session) return <UserSignInLink />;

  return (
    <div className="w-auto flex items-center gap-1">
      {canManage && <UserDashboardLink />}

      <div className="w-auto flex items-center gap-2">
        <UserAccountLinkMenu />
        <UserWishlistAndCart initialCounters={counters} />
      </div>
    </div>
  );
};

export default memo(UserMenu);
