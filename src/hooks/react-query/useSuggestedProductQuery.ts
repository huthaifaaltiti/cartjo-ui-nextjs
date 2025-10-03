import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { DataListResponse } from "@/types/service-response.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { fetcher } from "@/utils/fetcher";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getSuggestedProductsQueryOptions } from "@/utils/queryOptions";

interface FetchSuggestedProductsProps {
  lang?: Locale | string;
  limit?: number;
}

export const fetchSuggestedProducts = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.PUBLIC_SUGGESTED_PRODUCTS_ITEMS,
}: FetchSuggestedProductsProps): Promise<DataListResponse<Product>> => {
  const url = new URL(API_ENDPOINTS.PRODUCT.SUGGESTED);

  console.log("fetchSuggestedProducts");

  if (lang) url.searchParams.append("lang", lang.toString());
  if (limit) url.searchParams.append("limit", limit.toString());

  return fetcher<DataListResponse<Product>>(url, {});
};

export const useSuggestedProductQuery = (
  lang: string | Locale,
  limit: number
) => {
  const { locale } = useAuthContext();

  return useQuery(getSuggestedProductsQueryOptions(lang || locale, limit));
};
