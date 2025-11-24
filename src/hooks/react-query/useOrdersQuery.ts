import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/authOptions";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";
import { PaymentMethods } from "@/enums/paymentMethods.enum";

interface FetchOrdersParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: PaymentMethods;
}

export const fetchOrders = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.ORDERS,
  lastId,
  search,
  amountMin,
  amountMax,
  paymentMethod
}: FetchOrdersParams): Promise<DataListResponse<Order>> => {
  const url = new URL(API_ENDPOINTS.ORDER.GetAll);

  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("lang", lang);
  if (amountMin !== undefined && amountMin > 0)
    url.searchParams.append("amountMin", String(amountMin));
  if (amountMax !== undefined && amountMax > 0)
    url.searchParams.append("amountMax", String(amountMax));
  if (paymentMethod) url.searchParams.append("paymentMethod", String(paymentMethod));

  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve orders");

  return res.json();
};

export const useOrdersQuery = ({
  searchQuery,
  queryKey,
  amountMin,
  amountMax,
  paymentMethod
}: {
  searchQuery: string;
  queryKey: string;
  amountMin?: number;
  amountMax?: number;
  paymentMethod?: PaymentMethods;
}) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Order>>({
    queryKey: [queryKey, searchQuery, amountMin, amountMax, paymentMethod],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchOrders({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.ORDERS,
        lastId: pageParam as string,
        search: searchQuery,
        amountMin,
        amountMax,
        paymentMethod
      });
    },

    getNextPageParam: (lastPage) => {
      if (lastPage.data && lastPage.data.length > 0) {
        const lastItem = lastPage.data[lastPage.data.length - 1];
        return lastItem._id;
      }
      return undefined;
    },

    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
