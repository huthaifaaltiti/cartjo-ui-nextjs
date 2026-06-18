import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { Locale } from "@/types/locale";

export const PUBLIC_SUGGESTED_PRODUCTS_QUERY_KEY =
  "suggestedPublicProducts" as const;

export const getSuggestedProductsQueryOptions = ({
  locale,
  limit,
  productId,
  queryFn,
}: {
  locale: Locale | string;
  limit: number;
  productId?: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Product>>;
}) => ({
  queryKey: [PUBLIC_SUGGESTED_PRODUCTS_QUERY_KEY, locale, limit, productId],
  queryFn,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
});
