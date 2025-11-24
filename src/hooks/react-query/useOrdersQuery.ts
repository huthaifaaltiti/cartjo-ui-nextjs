import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/lib/authOptions";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Order } from "@/types/order.type";

interface FetchOrdersParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchOrders = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.ORDERS,
  lastId,
  search,
}: FetchOrdersParams): Promise<DataListResponse<Order>> => {
  const url = new URL(API_ENDPOINTS.ORDER.GetAll);

  url.searchParams.append("limit", limit.toString());
  url.searchParams.append("lang", lang);

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
}: {
  searchQuery: string;
  queryKey: string;
}) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Order>>({
    queryKey: [queryKey, searchQuery],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchOrders({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.ORDERS,
        lastId: pageParam as string,
        search: searchQuery,
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
