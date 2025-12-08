"use client";

import { memo } from "react";

import { Product } from "@/types/product.type";

import { useProductsQuery } from "@/hooks/react-query/useProductsQuery";

import InfiniteScrollList from "../../../shared/InfiniteScrollList";
import { useProducts } from "@/contexts/Products.context";
import ProductCard from "./ProductCard";

type ProductsListProps = {
  initialProducts: Product[];
};

const ProductsList = ({ initialProducts }: ProductsListProps) => {
  const {
    queryKey,
    searchQuery,
    token,
    deleteProduct,
    unDeleteProduct,
    switchProductActiveStatus,
  } = useProducts();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useProductsQuery({
    search: searchQuery,
  });

  const products = data?.pages.flatMap((page) => page.data) || initialProducts;

  return (
    <InfiniteScrollList
      isLoading={isLoading}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      error={error}
      list={products}
      fetchNextPage={fetchNextPage}
      ListItemCard={ProductCard}
      cardProps={{
        deleteProduct,
        unDeleteProduct,
        switchProductActiveStatus,
        queryKey,
        accessToken: token,
      }}
    />
  );
};

export default memo(ProductsList);
