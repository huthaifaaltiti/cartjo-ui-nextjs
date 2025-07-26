"use client";

import { memo } from "react";

import { Category } from "@/types/category";
import { useCategoriesQuery } from "@/hooks/react-query/useCategoriesQuery";
import { useCategories } from "@/contexts/CategoriesContext";

import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import CategoryCard from "./CategoryCard";

type CategoriesListProps = {
  initialCategories: Category[];
};

const CategoriesList = ({ initialCategories }: CategoriesListProps) => {
  const {
    queryKey,
    searchQuery,
    accessToken,
    deleteCategory,
    unDeleteCategory,
    switchCategoryActiveStatus,
  } = useCategories();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useCategoriesQuery(searchQuery);

  const categories = data?.pages.flatMap((page) => page.data) || [
    ...initialCategories,
  ];

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={categories}
      fetchNextPage={fetchNextPage}
      ListItemCard={CategoryCard}
      cardProps={{
        deleteCategory,
        unDeleteCategory,
        switchCategoryActiveStatus,
        queryKey,
        accessToken,
      }}
    />
  );
};

export default memo(CategoriesList);
