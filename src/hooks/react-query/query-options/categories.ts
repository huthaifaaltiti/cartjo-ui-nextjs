import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Category } from "@/types/category.type";

export const CATEGORIES_KEY = "categories" as const;

interface CategoriesQueryOptionsParams {
  locale: string | Locale;
  search?: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Category>>;
}

export const getCategoriesQueryOptions = ({
  locale,
  search,
  queryFn,
}: CategoriesQueryOptionsParams) => {
  const getNextPageParam = (lastPage: DataListResponse<Category>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  };

  return {
    queryKey: [CATEGORIES_KEY, search, locale],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
