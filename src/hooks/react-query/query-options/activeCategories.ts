import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Category } from "@/types/category.type";

export const ACTIVE_CATEGORIES_QUERY_KEY = "activeCategories" as const;

export const getActiveCategoriesQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Category>>;
}) => ({
  queryKey: [ACTIVE_CATEGORIES_QUERY_KEY, locale],
  queryFn,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
