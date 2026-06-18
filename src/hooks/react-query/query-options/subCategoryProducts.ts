import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";

export const PUBLIC_SUB_CATEGORY_PRODUCTS_QUERY_KEY =
  "publicSubCategoryProducts" as const;

interface SubCategoryProductsParams {
  locale: string | Locale;
  categoryId: string;
  subCategoryId: string;
  priceFrom?: number;
  priceTo?: number;
  ratingFrom?: number;
  createdFrom?: string;
  createdTo?: string;
  beforeNumOfDays?: number;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Product>>;
}

export const getSubCategoryProductsQueryOptions = (
  params: SubCategoryProductsParams,
) => {
  const { queryFn, ...filters } = params;

  const getNextPageParam = (lastPage: DataListResponse<Product>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: [PUBLIC_SUB_CATEGORY_PRODUCTS_QUERY_KEY, filters],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!params?.categoryId && !!params?.subCategoryId,
  };
};
