import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Comment } from "@/types/comment.type";

interface FetchProductCommentsProps {
  lang?: Locale | string;
  limit?: number;
  lastId?: string;
  productId: string;
  fetcher: (url: string) => Promise<DataListResponse<Comment>>;
}

export const fetchProductComments = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.PUBLIC_VIEW.PRODUCT_COMMENTS ?? 20,
  lastId,
  productId,
  fetcher,
}: FetchProductCommentsProps): Promise<DataListResponse<Comment>> => {
  const url = new URL(`${API_ENDPOINTS.PRODUCT.COMMENTS}`);

  if (lang) url.searchParams.append("lang", lang.toString());
  if (productId) url.searchParams.append("productId", productId.toString());
  if (limit) url.searchParams.append("limit", productId.toString());
  if (lastId) url.searchParams.append("lastId", lastId);

  return fetcher(url.toString());
};
