import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product.type";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { fetcher } from "@/utils/fetcher";
import { Comment } from "@/types/comment.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getProductQueryOptions } from "@/utils/queryOptions";

interface FetchProductProps {
  token?: string | null;
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
  productId,
}: Pick<FetchProductProps, "lang" | "productId">) => {
  const { locale, accessToken } = useAuthContext();

  return useQuery(getProductQueryOptions(locale, productId, accessToken));
};
