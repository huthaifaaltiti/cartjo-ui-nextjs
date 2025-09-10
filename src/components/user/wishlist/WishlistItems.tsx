"use client";

import { memo, useEffect, useMemo } from "react";
import { useWishlistQuery } from "@/hooks/react-query/useWishlistQuery";
import { Product } from "@/types/product.type";
import { useWishlist } from "@/contexts/Wishlist.context";
import { useAuthContext } from "@/hooks/useAuthContext";
import WishlistProductCard from "./WishlistProductCard";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import NoWishlistItems from "./NoWishlistItems";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import PageLoader from "@/components/shared/PageLoader";

const WishlistItems = () => {
  const t = useTranslations();
  const { setWishlistItemsCount } = useWishlist();
  const { accessToken, status } = useAuthContext();

  // Fetch data directly using the hook.
  // The initial data will be read from the dehydrated cache.
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

  const wishlistProducts = useMemo(() => {
    const allProducts =
      (data?.pages?.flatMap(
        (page) => page?.data?.products || []
      ) as Product[]) || [];
    return allProducts;
  }, [data]);

  useEffect(() => {
    const totalWishlistItemsCount = data?.pages[0]?.data?.productsCount ?? 0;
    setWishlistItemsCount(totalWishlistItemsCount);
  }, [wishlistProducts.length, setWishlistItemsCount]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // loading session
  if (status === "loading") {
    return <PageLoader />;
  }

  // user is not authenticated
  if (status === "unauthenticated" || !accessToken) {
    return <div>Please log in to view your wishlist.</div>;
  }

  // loading wishlist items
  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="w-full min-h-[50vh] h-full flex items-center justify-center">
        <ErrorMessage
          message={error?.message || t("routes.wishlist.errors.failedLoadData")}
        />
      </div>
    );
  }

  if (wishlistProducts.length === 0) {
    return <NoWishlistItems />;
  }

  return (
    <>
      <InfiniteScrollList
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        list={wishlistProducts}
        fetchNextPage={fetchNextPage}
        ListItemCard={WishlistProductCard}
        cardProps={{}}
      />
    </>
  );
};

export default memo(WishlistItems);
