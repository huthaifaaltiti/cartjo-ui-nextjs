"use client";

import { memo } from "react";
import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import { useTypeHintConfigsQuery } from "@/hooks/react-query/useTypeHintConfigsQuery";
import TypeHintConfigCard from "./TypeHintConfigCard";

type TypeHintConfigsListProps = {
  initialData: TypeHintConfig[];
};

const TypeHintConfigsList = ({ initialData }: TypeHintConfigsListProps) => {
  const {
    queryKey,
    searchQuery,
    token: accessToken,
    deleteTypeHintConfig,
    unDeleteTypeHintConfig,
    switchTypeHintConfigActiveStatus,
  } = useTypeHintConfig();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useTypeHintConfigsQuery({ search: searchQuery });

  const typeHintConfigs = data?.pages.flatMap((page) => page.data) || [
    ...initialData,
  ];

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={typeHintConfigs}
      fetchNextPage={fetchNextPage}
      ListItemCard={TypeHintConfigCard}
      cardProps={{
        deleteTypeHintConfig,
        unDeleteTypeHintConfig,
        switchTypeHintConfigActiveStatus,
        queryKey,
        accessToken,
      }}
    />
  );
};

export default memo(TypeHintConfigsList);
