import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Product } from "@/types/product.type";

export const CATEGORY_PICKS_QUERY_KEY = "categoriesPicks" as const;

export const getCategoriesPicksQueryOptions = ({
  locale,
  categoryId,
  queryFn,
}: {
  locale: string | Locale;
  categoryId: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Product>>;
}) => ({
  queryKey: [CATEGORY_PICKS_QUERY_KEY, locale, categoryId],
  queryFn,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
