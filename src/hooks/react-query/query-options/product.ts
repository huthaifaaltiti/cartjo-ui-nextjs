import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Product } from "@/types/product.type";

export const PUBLIC_PRODUCT_QUERY_KEY = "publicProduct" as const;

export const getProductQueryOptions = ({
  locale,
  productId,
  queryFn,
}: {
  locale: string | Locale;
  productId: string;
  queryFn: (context: QueryFunctionContext) => Promise<DataResponse<Product>>;
}) => {
  return {
    queryKey: [PUBLIC_PRODUCT_QUERY_KEY, locale, productId],
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
  };
};
