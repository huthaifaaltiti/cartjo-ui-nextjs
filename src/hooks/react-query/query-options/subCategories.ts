import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { SubCategory } from "@/types/subCategory";

export const SUB_CATEGORIES_KEY = "subCategories" as const;

interface CategoriesQueryOptionsParams {
  locale: string | Locale;
  search?: string;
  catId?: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<SubCategory>>;
}

export const getSubCategoriesQueryOptions = ({
  locale,
  search,
  catId,
  queryFn,
}: CategoriesQueryOptionsParams) => {
  const getNextPageParam = (lastPage: DataListResponse<SubCategory>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  };

  return {
    queryKey: [SUB_CATEGORIES_KEY, search, locale, catId],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
