"use client";

import { memo } from "react";
import { useSubCategories } from "@/contexts/SubCategoriesContext";

import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import SubCategoryCard from "./SubCategoryCard";
import { SubCategory } from "@/types/subCategory";
import { useSubCategoriesQuery } from "@/hooks/react-query/useSubCategoriesQuery";

type SubCategoriesListProps = {
  initialSubCategories: SubCategory[];
};

const SubCategoriesList = ({
  initialSubCategories,
}: SubCategoriesListProps) => {
  const {
    queryKey,
    searchQuery,
    accessToken,
    deleteSubCategory,
    unDeleteSubCategory,
    switchSubCategoryActiveStatus,
    selectedCatId,
  } = useSubCategories();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSubCategoriesQuery({
    search: searchQuery,
    catId: selectedCatId,
  });

  const subCategories =
    data?.pages.flatMap((page) => page.subCategories) || initialSubCategories;

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={subCategories}
      fetchNextPage={fetchNextPage}
      ListItemCard={SubCategoryCard}
      cardProps={{
        deleteSubCategory,
        unDeleteSubCategory,
        switchSubCategoryActiveStatus,
        queryKey,
        accessToken,
      }}
    />
  );
};

export default memo(SubCategoriesList);
