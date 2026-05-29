"use client";

import { memo, useEffect } from "react";
import InfiniteScrollList, {
  GRID_TYPE,
  LAYOUT_TYPE,
} from "../../../shared/InfiniteScrollList";
import BannerCard from "./BannerCard";
import {
  deleteBanner,
  restoreBanner,
  switchBannerActiveStatus,
} from "@/redux/slices/banners/actions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useBannersQuery } from "@/hooks/react-query/useBannersQuery";
import { setBannersItems } from "@/redux/slices/banners";
import { useAuthContext } from "@/hooks/useAuthContext";
import PageLoader from "@/components/shared/PageLoader";
import AuthRedirect from "@/components/shared/AuthRedirect";
import ErrorMessage from "@/components/shared/ErrorMessage";

const BannersList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated, isSessionLoading } = useAuthContext();

  const {
    items,

    error: reduxError,
    searchQuery,
  } = useSelector((state: RootState) => state.banners);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    isError,
  } = useBannersQuery({ search: searchQuery });

  useEffect(() => {
    const fetched = data?.pages?.flatMap((p) => p?.data || []) ?? [];

    if (fetched.length > 0) {
      dispatch(setBannersItems(fetched));
    } else {
      dispatch(setBannersItems([]));
    }
  }, [data, dispatch]);

  const showLoader = isLoading || isSessionLoading;
  const showError = isError;
  const showNoData = items.length === 0;
  const showData = items.length > 0;

  if (showLoader) return <PageLoader />;

  if (!isAuthenticated) {
    return <AuthRedirect redirectLocation={"/dashboard/banners"} />;
  }

  if (showError) {
    return (
      <div className="w-full min-h-[50vh] flex items-center justify-center">
        <ErrorMessage
          message={error?.message || reduxError || "Failed to load banners"}
        />
      </div>
    );
  }

  if (showNoData) {
    return (
      <>
        <div className="w-full min-h-[50vh] flex items-center justify-center">
          <p className="text-gray-500 text-lg">No Data</p>
        </div>
      </>
    );
  }

  if (showData) {
    return (
      <InfiniteScrollList
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        error={error}
        list={items}
        fetchNextPage={fetchNextPage}
        ListItemCard={BannerCard}
        layout={LAYOUT_TYPE.GRID}
        gridType={GRID_TYPE.WIDE}
        cardProps={{
          deleteBanner: (bannerId: string, lang: string) =>
            dispatch(
              deleteBanner({
                id: bannerId,
                lang,
              }),
            ).unwrap(),

          unDeleteBanner: (bannerId: string, lang: string) =>
            dispatch(
              restoreBanner({
                id: bannerId,
                lang,
              }),
            ).unwrap(),

          switchBannerActiveStatus: (
            bannerId: string,
            lang: string,
            isActive: boolean,
          ) =>
            dispatch(
              switchBannerActiveStatus({
                id: bannerId,
                lang,
                isActive,
              }),
            ).unwrap(),
        }}
      />
    );
  }

  return null;
};

export default memo(BannersList);
