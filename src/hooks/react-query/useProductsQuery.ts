import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { ViewMode } from "@/types/common";
import { Product } from "@/types/product.type";
import { DataListResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { useAuthContext } from "../useAuthContext";
import { getCategoriesPicksQueryOptions } from "./query-options/categoryPicks";
import { fetchCategoriesPicks } from "@/services/category.service";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { authFetcher } from "@/utils/authFetcher";
import { getProductsQueryOptions } from "./query-options/products";
import { fetchProducts } from "@/services/product.service";

export const useProductsQuery = ({
  search,
  viewMode,
}: {
  search?: string;
  viewMode: ViewMode;
}) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    ...getProductsQueryOptions({
      locale,
      search,
      viewMode,
      queryFn: (context: QueryFunctionContext) =>
        fetchProducts({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.PRODUCTS,
          lastId: context?.pageParam as string,
          search,
          viewMode,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};

export const useCategoriesPicksQuery = (categoryId: string) => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getCategoriesPicksQueryOptions({
      locale: locale ?? LocaleEnum.EN,
      categoryId,
      queryFn: () =>
        fetchCategoriesPicks({
          lang: locale ?? LocaleEnum.EN,
          categoryId,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: true,
  });
};
