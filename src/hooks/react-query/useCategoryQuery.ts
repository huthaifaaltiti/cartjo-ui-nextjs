import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { Product } from "@/types/product.type";
import { getCategoryQueryOptions } from "./query-options/category";
import {
  fetchCategory,
  fetchCategoryProducts,
} from "@/services/category.service";
import { authFetcher } from "@/utils/authFetcher";
import { getCategoryProductsQueryOptions } from "./query-options/categoryProducts";

export const useCategoryQuery = (categoryId?: string) => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getCategoryQueryOptions({
      locale,
      categoryId,
      queryFn: () =>
        fetchCategory({
          lang: locale as Locale,
          categoryId,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};

export const useCategoryProductsQuery = (
  categoryId: string,
  priceFrom?: number,
  priceTo?: number,
  ratingFrom?: number,
  createdFrom?: string,
  createdTo?: string,
  beforeNumOfDays?: number,
) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    ...getCategoryProductsQueryOptions({
      categoryId,
      locale,
      priceFrom,
      priceTo,
      ratingFrom,
      createdFrom,
      createdTo,
      beforeNumOfDays,
      queryFn: ({ pageParam }) =>
        fetchCategoryProducts({
          lang: locale as Locale,
          categoryId,
          priceFrom,
          lastId: pageParam as string,
          priceTo,
          ratingFrom,
          createdFrom,
          createdTo,
          beforeNumOfDays,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
