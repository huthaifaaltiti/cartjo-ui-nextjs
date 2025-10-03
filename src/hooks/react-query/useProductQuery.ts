import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { FetchError } from "@/types/common";
import { fetcher } from "@/utils/fetcher";
import { Comment } from "@/types/comment.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

interface FetchProductProps {
  token?: string;
  lang?: Locale | string;
  productId: string;
}

export const fetchProduct = async ({
  token,
  lang = "en",
  productId,
}: FetchProductProps): Promise<DataResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.PRODUCT.ONE}/${productId}`);
  if (lang) url.searchParams.append("lang", lang.toString());

  return fetcher<DataResponse<Product>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

interface FetchProductCommentsProps {
  lang?: Locale | string;
  limit?: number;
  lastId?: string;
  productId: string;
}

export const fetchProductComments = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.PUBLIC_PRODUCT_COMMENTS_ITEMS,
  lastId,
  productId,
}: FetchProductCommentsProps): Promise<DataListResponse<Comment>> => {
  const url = new URL(`${API_ENDPOINTS.PRODUCT.COMMENTS}`);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (productId) url.searchParams.append("productId", productId.toString());
  if (limit) url.searchParams.append("limit", productId.toString());
  if (lastId) url.searchParams.append("lastId", lastId);

  return fetcher<DataListResponse<Comment>>(url, {});
};

export const useProductQuery = ({
  lang = "en",
  productId,
}: Pick<FetchProductProps, "lang" | "productId">) => {
  const { locale, accessToken } = useAuthContext();

  return useQuery({
    queryKey: ["publicProduct", lang, productId],
    queryFn: () =>
      fetchProduct({
        token: accessToken,
        lang: lang || locale,
        productId: productId!,
      }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
    retry: (failureCount, error) => {
      const err = error as FetchError;
      if (err?.status === 404) return false;
      return failureCount < 2; // Only retry up to 2 times for other errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
