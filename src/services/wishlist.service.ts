import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Wishlist } from "@/types/wishlist.type";

interface FetchWishlistItemsParams {
  lang?: Locale;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataResponse<Wishlist>>;
}

export const fetchWishlistItems = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.USER_VIEW.WISHLIST_ITEMS ?? 20,
  lastId,
  fetcher,
}: FetchWishlistItemsParams): Promise<DataResponse<Wishlist>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.WISHLIST.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);

  return fetcher(url.pathname + url.search);
};
