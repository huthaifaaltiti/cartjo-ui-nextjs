import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { DataListResponse } from "@/types/service-response.type";
import { SubCategory } from "@/types/subCategory";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getSubCategoriesQueryOptions } from "./query-options/subCategories";
import { fetchSubCategories } from "@/services/subCategory.service";
import { useAuthContext } from "../useAuthContext";
import { authFetcher } from "@/utils/authFetcher";

export const useSubCategoriesQuery = ({
  search,
  catId,
}: {
  search?: string;
  catId?: string;
}) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<SubCategory>>({
    ...getSubCategoriesQueryOptions({
      locale,
      search,
      catId,
      queryFn: (context: QueryFunctionContext) =>
        fetchSubCategories({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.SUB_CATEGORIES,
          lastId: context?.pageParam as string,
          search,
          catId,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};
