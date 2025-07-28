"use client";

import { memo } from "react";

import { Logo } from "@/types/logo";
import { useLogosQuery } from "@/hooks/react-query/useLogosQuery";
import { useLogos } from "@/contexts/LogosContext";

import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import LogoCard from "./LogoCard";

type LogosListProps = {
  initialLogos: Logo[];
};

const LogosList = ({ initialLogos }: LogosListProps) => {
  const {
    queryKey,
    searchQuery,
    accessToken,
    deleteLogo,
    unDeleteLogo,
    switchLogoActiveStatus,
  } = useLogos();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useLogosQuery(searchQuery);

  const logos = data?.pages.flatMap((page) => page.data) || [...initialLogos];

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={logos}
      fetchNextPage={fetchNextPage}
      ListItemCard={LogoCard}
      cardProps={{
        deleteLogo,
        unDeleteLogo,
        switchLogoActiveStatus,
        queryKey,
        accessToken,
      }}
    />
  );
};

export default memo(LogosList);
