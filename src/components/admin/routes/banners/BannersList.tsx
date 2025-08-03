"use client";

import { memo } from "react";

import { useBannersQuery } from "@/hooks/react-query/useBannersQuery";

import { Banner } from "@/types/banner.type";

import InfiniteScrollList from "../../../shared/InfiniteScrollList";
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
    // deleteLogo,
    // unDeleteLogo,
    // switchLogoActiveStatus,
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
      cardProps={{
        // deleteLogo,
        // unDeleteLogo,
        // switchLogoActiveStatus,
        queryKey,
        accessToken: token,
      }}
    />
  );
};

export default memo(BannersList);
