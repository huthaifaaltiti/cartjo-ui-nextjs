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
import OrdersListFilters from "./OrdersListFilters";
import { useQueryState } from "nuqs";
import { PaymentMethods } from "@/enums/paymentMethods.enum";

const OrdersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isSessionLoading } = useAuthContext();

  const {
    searchQuery,
    queryKey,
    items: reduxOrders,
  } = useSelector((state: RootState) => state.orders);

  const [amountMin, setAmountMin] = useQueryState<number>("amountMin", {
    defaultValue: 0,
    parse: (value) => Number(value),
    serialize: (value) => String(value),
  });

  const [amountMax, setAmountMax] = useQueryState<number>("amountMax", {
    defaultValue: 0,
    parse: (value) => Number(value),
    serialize: (value) => String(value),
  });

  const [paymentMethod, setPaymentMethod] =
    useQueryState<PaymentMethods | null>("paymentMethod", {
      defaultValue: null,
      parse: (value) =>
        value === PaymentMethods.Cash || value === PaymentMethods.Card ? (value as PaymentMethods) : null,
      serialize: (value) => (value ? String(value) : ""),
    });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useOrdersQuery({
    searchQuery,
    queryKey,
    amountMin,
    amountMax,
    paymentMethod,
  });

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
      <>
        <OrdersListFilters
          amountMin={amountMin}
          amountMax={amountMax}
          setAmountMin={setAmountMin}
          setAmountMax={setAmountMax}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      </>
    );

  if (showData) {
    return (
      <>
        <OrdersListFilters
          amountMin={amountMin}
          amountMax={amountMax}
          setAmountMin={setAmountMin}
          setAmountMax={setAmountMax}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
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
      </>
    );
  }

  return null;
};

export default memo(OrdersList);
