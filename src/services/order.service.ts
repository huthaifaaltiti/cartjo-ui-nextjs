import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { Locale } from "@/types/locale";

interface FetchUserOrdersParams {
  uid: string;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<Order>>;
}

export const fetchUserOrders = async ({
  uid,
  lang = "en",
  limit = PAGINATION_LIMITS.USER_VIEW.ORDERS,
  lastId,
  search,
  fetcher,
}: FetchUserOrdersParams) => {
  if (!uid) throw new Error("uid is required");

  const url = new URL(`${API_ENDPOINTS.ORDER.GetMyOrders}/${uid}`);
  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang.toString());
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
