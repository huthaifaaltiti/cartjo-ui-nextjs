import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { ViewMode } from "@/types/common";

export const PRODUCTS_KEY = "products" as const;

interface ProductsQueryOptionsParams {
  locale: string | Locale;
  search?: string;
  viewMode?: ViewMode;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Product>>;
}

export const getProductsQueryOptions = ({
  locale,
  search,
  viewMode,
  queryFn,
}: ProductsQueryOptionsParams) => {
  const getNextPageParam = (lastPage: DataListResponse<Product>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  };

  return {
    queryKey: [PRODUCTS_KEY, search, locale, viewMode],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
