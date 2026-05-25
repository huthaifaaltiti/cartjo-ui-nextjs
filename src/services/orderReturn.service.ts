import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

interface FetchUserOrderReturnsParams {
  uid: string | undefined;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<Order>>;
}

export const fetchUserOrderReturns = async ({
  uid,
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.USER_ORDERS,
  lastId,
  search,
  fetcher,
}: FetchUserOrderReturnsParams): Promise<DataListResponse<Order>> => {
  if (!uid) throw new Error("User ID is required");

  const url = new URL(
    `${API_ENDPOINTS.ORDER.GetMyOrderReturns.replace("$uid", uid)}`,
  );

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang.toString());
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
