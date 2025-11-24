"use client";

import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { useOrdersQuery } from "@/hooks/react-query/useOrdersQuery";
import InfiniteScrollList from "@/components/shared/InfiniteScrollList";
import OrderCard from "./OrderCard";
import ErrorMessage from "@/components/shared/ErrorMessage";
import PageLoader from "@/components/shared/PageLoader";
import { useAuthContext } from "@/hooks/useAuthContext";
import AuthRedirect from "@/components/shared/AuthRedirect";
import { setOrdersItems } from "@/redux/slices/orders";

const OrdersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isSessionLoading } = useAuthContext();

  const {
    searchQuery,
    queryKey,
    items: reduxOrders,
  } = useSelector((state: RootState) => state.orders);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useOrdersQuery({ searchQuery, queryKey });

  useEffect(() => {
    const fetched = data?.pages?.flatMap((p) => p?.data || []) ?? [];

    if (fetched.length > 0) {
      dispatch(setOrdersItems(fetched));
    } else {
      dispatch(setOrdersItems([]));
    }
  }, [data, dispatch]);

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = reduxOrders.length === 0;
  const showData = reduxOrders.length > 0;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/orders"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage message={error?.message || "Failed to load orders"} />
      </div>
    );
  }

  if (showNoData)
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">No orders found</p>
      </div>
    );

  if (showData) {
    return (
      <InfiniteScrollList
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        list={reduxOrders}
        fetchNextPage={fetchNextPage}
        ListItemCard={OrderCard}
        layout="grid"
        cardProps={{ queryKey }}
      />
    );
  }

  return null;
};

export default memo(OrdersList);
