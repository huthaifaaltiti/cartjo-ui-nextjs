"use client";

import { memo } from "react";
import { useBannersQuery } from "@/hooks/react-query/useBannersQuery";
import { Banner } from "@/types/banner.type";
import InfiniteScrollList, { GRID_TYPE } from "../../../shared/InfiniteScrollList";
import { useBanners } from "@/contexts/Banners.context";
import BannerCard from "./BannerCard";

type BannersListProps = {
  initialBanners: Banner[];
};

const BannersList = ({ initialBanners }: BannersListProps) => {
  const {
    queryKey,
    searchQuery,
    token,
    deleteBanner,
    unDeleteBanner,
    switchBannerActiveStatus,
  } = useBanners();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useBannersQuery({ search: searchQuery });

  const banners = data?.pages.flatMap((page) => page.data) || [
    ...initialBanners,
  ];

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={banners}
      fetchNextPage={fetchNextPage}
      ListItemCard={BannerCard}
      layout="grid"
      gridType={GRID_TYPE.WIDE}
      cardProps={{
        deleteBanner,
        unDeleteBanner,
        switchBannerActiveStatus,
        queryKey,
        accessToken: token,
      }}
    />
  );
};

export default memo(BannersList);
