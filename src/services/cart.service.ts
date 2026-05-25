import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Cart } from "@/types/cart.type";

interface FetchCartItemsParams {
  lang?: Locale;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataResponse<Cart>>;
}

export const fetchCartItems = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.USER_VIEW.CART_ITEMS ?? 20,
  lastId,
  fetcher,
}: FetchCartItemsParams): Promise<DataResponse<Cart>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.CART.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);

  return fetcher(url.pathname + url.search);
};
