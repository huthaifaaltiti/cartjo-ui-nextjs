"use client";

import { memo, useEffect, useMemo } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import CartProductCard from "./CartProductCard";
import InfiniteScrollList, {
  GRID_TYPE,
} from "@/components/shared/InfiniteScrollList";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import PageLoader from "@/components/shared/PageLoader";
import NoCartItems from "./NoCartItems";
import { useCartQuery } from "@/hooks/react-query/useCartQuery";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setCartItems } from "@/redux/slices/cart";
import CartOrderStatus from "./CartOrderStatus";
import { CartItem } from "@/types/cartItem.type";
import AuthRedirect from "@/components/shared/AuthRedirect";

const CartItems = () => {
  const t = useTranslations();
  const { isSessionLoading, isAuthenticated } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems } = useSelector((state: RootState) => state.cart);
  const { isArabic } = useSelector((state: RootState) => state.general);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useCartQuery();

  const fetchedItems = useMemo(
    () => data?.pages?.flatMap((page) => page?.data?.items || []) ?? [],
    [data]
  );

  const showData = (cartItems as CartItem[]).length !== 0;
  const showNoData = !cartItems || (cartItems as CartItem[]).length === 0;
  const showError = isError;
  const showLoader = isLoading || isSessionLoading;

  useEffect(() => {
    if (fetchedItems.length > 0) {
      dispatch(setCartItems(fetchedItems));
    }
  }, [fetchedItems, dispatch]);

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/cart"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          message={error?.message || t("routes.cart.errors.failedLoadData")}
        />
      </div>
    );
  }

  if (showNoData) return <NoCartItems />;

  if (showData) {
    return (
      <div className="w-full h-auto flex gap-1">
        <div className="w-2/3 p-2">
          <InfiniteScrollList
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            hasNextPage={hasNextPage}
            error={error}
            list={cartItems}
            fetchNextPage={fetchNextPage}
            ListItemCard={CartProductCard}
            cardProps={{
              isArabic,
            }}
            gridType={GRID_TYPE.WIDE}
          />
        </div>

        <div className="w-1/3 p-2">
          <CartOrderStatus />
        </div>
      </div>
    );
  }

  return null;
};

export default memo(CartItems);
