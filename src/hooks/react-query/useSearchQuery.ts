import { useInfiniteQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { useAuthContext } from "../useAuthContext";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";
import { fetchSearchProducts } from "@/services/product.service";
import { getSearchProductsQueryOptions } from "./query-options/publicSearchedProducts";
import { authFetcher } from "@/utils/authFetcher";

export const useSearchProductsQuery = (
  querySearch: string,
  categoryId?: string,
  subCategoryId?: string,
  priceFrom?: number,
  priceTo?: number,
  ratingFrom?: number,
  createdFrom?: string,
  createdTo?: string,
  beforeNumOfDays?: number,
  typeHint?: string,
) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    ...getSearchProductsQueryOptions({
      locale,
      querySearch,
      categoryId,
      subCategoryId,
      priceFrom,
      priceTo,
      ratingFrom,
      createdFrom,
      createdTo,
      beforeNumOfDays,
      typeHint,
      queryFn: ({ pageParam }) => {
        if (!querySearch && !typeHint) {
          throw new Error("No search text or hint provided");
        }

        return fetchSearchProducts({
          querySearch,
          lang: locale,
          categoryId,
          subCategoryId,
          limit: PAGINATION_LIMITS.PUBLIC_VIEW.SEARCH_PAGE_PRODUCTS_ITEMS,
          lastId: pageParam as string,
          priceFrom,
          priceTo,
          ratingFrom,
          createdFrom,
          createdTo,
          beforeNumOfDays,
          typeHint,
          fetcher: (path) => authFetcher(path),
        });
      },
    }),
    enabled: !!querySearch || !!typeHint,
  });
};
