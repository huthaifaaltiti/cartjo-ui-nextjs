"use client";

import { memo } from "react";

import { useShowcasesQuery } from "@/hooks/react-query/useShowcasesQuery";

import { Showcase } from "@/types/showcase.type";

import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import { useShowcases } from "@/contexts/Showcase.context";
import ShowcaseCard from "./ShowcaseCard";

type ShowcasesListProps = {
  initialShowcases: Showcase[];
};

const BannersList = ({ initialShowcases }: ShowcasesListProps) => {
  const {
    queryKey,
    searchQuery,
    accessToken,
    deleteShowcase,
    unDeleteShowcase,
    switchShowcaseActiveStatus,
  } = useShowcases();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useShowcasesQuery({ search: searchQuery });

  const showcases = data?.pages.flatMap((page) => page.data) || [
    ...initialShowcases,
  ];

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={showcases}
      fetchNextPage={fetchNextPage}
      ListItemCard={ShowcaseCard}
      cardProps={{
        deleteShowcase,
        unDeleteShowcase,
        switchShowcaseActiveStatus,
        queryKey,
        accessToken,
      }}
    />
  );
};

export default memo(BannersList);
