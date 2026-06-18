import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { Locale } from "@/types/locale";
import { PaymentMethods } from "@/enums/paymentMethods.enum";
import { PaymentStatus } from "@/enums/paymentStatus.enum";
import { OrderDeliveryStatus } from "@/enums/orderDeliveryStatus.enum";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

interface FetchUserOrdersParams {
  uid: string | undefined;
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

interface FetchOrdersParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: PaymentMethods;
  paymentStatus?: PaymentStatus;
  deliveryStatus?: OrderDeliveryStatus;
  createdAfter?: string;
  createdBefore?: string;
  fetcher: (url: string) => Promise<DataListResponse<Order>>;
}

export const fetchOrders = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.DASHBOARD_VIEW.ORDERS ?? 20,
  lastId,
  search,
  amountMin,
  amountMax,
  paymentMethod,
  paymentStatus,
  deliveryStatus,
  createdAfter,
  createdBefore,
  fetcher,
}: FetchOrdersParams): Promise<DataListResponse<Order>> => {
  const url = new URL(API_ENDPOINTS.ORDER.GetAll);

  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("lang", lang);

  if (amountMin !== undefined && amountMin > 0)
    url.searchParams.append("amountMin", String(amountMin));
  if (amountMax !== undefined && amountMax > 0)
    url.searchParams.append("amountMax", String(amountMax));
  if (paymentMethod)
    url.searchParams.append("paymentMethod", String(paymentMethod));
  if (paymentStatus)
    url.searchParams.append("paymentStatus", String(paymentStatus));
  if (deliveryStatus)
    url.searchParams.append("deliveryStatus", String(deliveryStatus));
  if (createdBefore !== undefined && createdBefore)
    url.searchParams.append("createdBefore", String(createdBefore));
  if (createdAfter !== undefined && createdAfter)
    url.searchParams.append("createdAfter", String(createdAfter));
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
