"use client";

import { memo, useEffect } from "react";
import { useWishlistQuery } from "@/hooks/react-query/useWishlistQuery";
import { Product } from "@/types/product.type";
import { useAuthContext } from "@/hooks/useAuthContext";
import WishlistProductCard from "./WishlistProductCard";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import NoWishlistItems from "./NoWishlistItems";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import PageLoader from "@/components/shared/PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { setWishlistItems } from "@/redux/slices/wishlist";
import AuthRedirect from "@/components/shared/AuthRedirect";

const WishlistItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );
  const t = useTranslations();
  const { isSessionLoading, isAuthenticated } = useAuthContext();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
    refetch,
  } = useWishlistQuery({ search: "" });

  const showData = (wishlistItems as Product[]).length !== 0;
  const showNoData =
    !wishlistItems || (wishlistItems as Product[]).length === 0;
  const showError = isError;
  const showLoader = isLoading || isSessionLoading;

  useEffect(() => {
    const fetchedItems =
      data?.pages?.flatMap((page) => page?.data?.products || []) ?? [];

    if (fetchedItems.length > 0) {
      dispatch(setWishlistItems(fetchedItems));
    }
  }, [data, dispatch]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/wishlist"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] h-full flex items-center justify-center">
        <ErrorMessage
          message={error?.message || t("routes.wishlist.errors.failedLoadData")}
        />
      </div>
    );
  }

  if (showNoData) return <NoWishlistItems />;

  if (showData) {
    return (
      <InfiniteScrollList
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        list={wishlistItems}
        fetchNextPage={fetchNextPage}
        ListItemCard={WishlistProductCard}
        cardProps={{}}
      />
    );
  }

  return null;
};

export default memo(WishlistItems);
