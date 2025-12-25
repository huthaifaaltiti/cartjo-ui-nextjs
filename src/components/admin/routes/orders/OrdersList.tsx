"use client";

import { memo, useCallback, useEffect } from "react";
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
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";

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
        value === PaymentMethods.Cash || value === PaymentMethods.Card
          ? (value as PaymentMethods)
          : null,
      serialize: (value) => (value ? String(value) : ""),
    });

  const [paymentStatus, setPaymentStatus] = useQueryState<PaymentStatus | null>(
    "paymentStatus",
    {
      defaultValue: null,
      parse: (value) =>
        value === PaymentStatus.FAILED ||
        value === PaymentStatus.PAID ||
        value === PaymentStatus.PENDING
          ? (value as PaymentStatus)
          : null,
      serialize: (value) => (value ? String(value) : ""),
    }
  );

  const [deliveryStatus, setDeliveryStatus] =
    useQueryState<OrderDeliveryStatus | null>("deliveryStatus", {
      defaultValue: null,
      parse: (value) => (value ? (value as OrderDeliveryStatus) : null),
      serialize: (value) => (value ? String(value) : ""),
    });

  const [createdBefore, setCreatedBefore] = useQueryState<string>(
    "createdBefore",
    {
      defaultValue: "",
      parse: (value) => value || "",
      serialize: (value) => value,
    }
  );
  const [createdAfter, setCreatedAfter] = useQueryState<string>(
    "createdAfter",
    {
      defaultValue: "",
      parse: (value) => value || "",
      serialize: (value) => value,
    }
  );

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
    paymentStatus,
    deliveryStatus,
    createdAfter,
    createdBefore,
  });

  useEffect(() => {
    const fetched = data?.pages?.flatMap((p) => p?.data || []) ?? [];

    if (fetched.length > 0) {
      dispatch(setOrdersItems(fetched));
    } else {
      dispatch(setOrdersItems([]));
    }
  }, [data, dispatch]);

  const handleApplyDateFilter = useCallback(
    (createdFromValue?: string, createdToValue?: string) => {
      setCreatedAfter(createdFromValue || "");
      setCreatedBefore(createdToValue || "");
    },
    [createdAfter, createdBefore, setCreatedAfter, setCreatedBefore]
  );

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
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          deliveryStatus={deliveryStatus}
          setDeliveryStatus={setDeliveryStatus}
          createdBefore={createdBefore}
          setCreatedBefore={setCreatedBefore}
          createdAfter={createdAfter}
          setCreatedAfter={setCreatedAfter}
          onApplyDateFilter={handleApplyDateFilter}
        />
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">No orders found</p>
        </div>
      </>
    );

  if (showData) {
    return (
      <>
        <div className="w-full flex">
          <OrdersListFilters
            amountMin={amountMin}
            amountMax={amountMax}
            setAmountMin={setAmountMin}
            setAmountMax={setAmountMax}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            paymentStatus={paymentStatus}
            setPaymentStatus={setPaymentStatus}
            deliveryStatus={deliveryStatus}
            setDeliveryStatus={setDeliveryStatus}
            createdBefore={createdBefore}
            setCreatedBefore={setCreatedBefore}
            createdAfter={createdAfter}
            setCreatedAfter={setCreatedAfter}
            onApplyDateFilter={handleApplyDateFilter}
          />
        </div>
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
