import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Category } from "@/types/category.type";
import { DataListResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Locale } from "@/types/locale";
import {
  fetchActiveCategories,
  fetchCategories,
} from "@/services/category.service";
import { getActiveCategoriesQueryOptions } from "./query-options/activeCategories";
import { authFetcher } from "@/utils/authFetcher";
import { useAuthContext } from "../useAuthContext";
import { getCategoriesQueryOptions } from "./query-options/categories";

export const useCategoriesQuery = (search?: string) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Category>>({
    ...getCategoriesQueryOptions({
      locale,
      search,
      queryFn: (context: QueryFunctionContext) =>
        fetchCategories({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.CATEGORIES,
          lastId: context?.pageParam as string,
          search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};

export const useActiveCategoriesQuery = () => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getActiveCategoriesQueryOptions({
      locale,
      queryFn: () =>
        fetchActiveCategories({
          lang: locale as Locale,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: true,
  });
};
