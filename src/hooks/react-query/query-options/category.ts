import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Category } from "@/types/category.type";

export const PUBLIC_CATEGORY_QUERY_KEY = "publicCategory" as const;

export const getCategoryQueryOptions = ({
  locale,
  categoryId,
  queryFn,
}: {
  locale: string | Locale;
  categoryId: string | undefined;
  queryFn: (context: QueryFunctionContext) => Promise<DataResponse<Category>>;
}) => ({
  queryKey: [PUBLIC_CATEGORY_QUERY_KEY, locale, categoryId],
  queryFn,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: !!categoryId,
});
