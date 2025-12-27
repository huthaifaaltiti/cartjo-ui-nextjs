"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import InfiniteScrollList, {
  GRID_TYPE,
} from "@/components/shared/InfiniteScrollList";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useTranslations } from "next-intl";
import PageLoader from "@/components/shared/PageLoader";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AuthRedirect from "@/components/shared/AuthRedirect";
import { Order } from "@/types/order.type";
import { setOrdersItems } from "@/redux/slices/orders";
import { debounce } from "@/utils/debounce";
import { DEBOUNCE_TIME_MS } from "@/config/time.config";
import NoUserOrderReturns from "./NoUserOrderReturns";
import UserOrderReturnCard from "./UserOrderReturnCard";
import { useUserOrdersReturnsQuery } from "@/hooks/react-query/useUserOrderReturnsQuery";

const debouncingTime = Number(DEBOUNCE_TIME_MS) || 500;

const UserOrderReturns = () => {
  const t = useTranslations();
  const { isSessionLoading, isAuthenticated } = useAuthContext();
  const dispatch = useDispatch<AppDispatch>();
  const { items, searchQuery } = useSelector(
    (state: RootState) => state.orders
  );
  const { isArabic, locale } = useSelector((state: RootState) => state.general);

  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const debouncer = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, debouncingTime),
    []
  );

  // SearchQuery debouncing
  useEffect(() => {
    debouncer(searchQuery);
  }, [searchQuery, debouncer]);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useUserOrdersReturnsQuery(debouncedSearch);

  const fetchedUserOrdersReturns = useMemo(
    () => data?.pages?.flatMap((page) => page?.data || []) ?? [],
    [data]
  );

  useEffect(() => {
    if (fetchedUserOrdersReturns.length > 0) {
      dispatch(setOrdersItems(fetchedUserOrdersReturns));
    } else {
      dispatch(setOrdersItems([]));
    }
  }, [fetchedUserOrdersReturns, dispatch]);

  const showData = (items as Order[]).length !== 0;
  const showNoData = !items || (items as Order[]).length === 0;
  const showError = isError;
  const showLoader = isLoading || isSessionLoading;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={`/user/returns?${searchQuery}`} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          message={
            error?.message ||
            t("routes.user.layout.routes.returns.errors.failedLoadData")
          }
        />
      </div>
    );
  }

  if (showNoData) return <NoUserOrderReturns />;

  if (showData) {
    return (
      <InfiniteScrollList
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        list={items}
        fetchNextPage={fetchNextPage}
        ListItemCard={UserOrderReturnCard}
        cardProps={{
          isArabic,
          locale,
        }}
        gridType={GRID_TYPE.WIDE}
        layout="list"
      />
    );
  }

  return null;
};

export default memo(UserOrderReturns);
