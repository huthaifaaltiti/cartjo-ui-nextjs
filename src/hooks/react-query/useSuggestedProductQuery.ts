import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { DataListResponse } from "@/types/service-response.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { fetcher } from "@/utils/fetcher";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

interface FetchSuggestedProductsProps {
  lang?: Locale | string;
  limit?: number;
  productId?: string;
}

export const fetchSuggestedProducts = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS,
  productId,
}: FetchSuggestedProductsProps): Promise<DataListResponse<Product>> => {
  const url = new URL(API_ENDPOINTS.PRODUCT.SUGGESTED);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (limit) url.searchParams.append("limit", limit.toString());
  if (productId) url.searchParams.append("mainProductId", productId.toString());

  return fetcher<DataListResponse<Product>>(url, {});
};

export const getSuggestedProductsQueryOptions = (
  locale: Locale | string,
  limit: number,
  productId?: string,
) => ({
  queryKey: ["suggestedPublicCategory", locale, limit, productId],
  queryFn: () => fetchSuggestedProducts({ lang: locale, limit, productId }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
  // retry: (failureCount, error) => {
  //   const err = error as FetchError;
  //   if (err?.status === 404) return false;
  //   return failureCount < 2; // Only retry up to 2 times for other errors
  // },
  // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

export const useSuggestedProductQuery = (
  lang: string | Locale,
  limit: number,
  productId?: string,
) => {
  const { locale } = useAuthContext();

  return useQuery(
    getSuggestedProductsQueryOptions(lang || locale, limit, productId),
  );
};
