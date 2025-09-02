import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { DataResponse } from "@/types/service-response.type";
import { Wishlist } from "@/types/wishlist.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { Locale } from "@/types/locale";

interface FetchWishlistItemsParams {
  token: string | null;
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchWishlistItems = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.WISHLIST_ITEMS,
  lastId,
  search,
}: FetchWishlistItemsParams): Promise<DataResponse<Wishlist>> => {
  const url = new URL(`${API_ENDPOINTS.LOGGED_USER.WISHLIST.ONE}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  handleUnauthorizedResponse(res, lang);

  if (!res.ok) throw new Error("Could not retrieve active wishlist list");

  const resObj = await res.json();

  return resObj;
};

export const useWishlistQuery = ({ search }: { search: string }) => {
  const { accessToken, locale } = useAuthContext();

  return useInfiniteQuery<DataResponse<Wishlist>>({
    queryKey: ["wishlistItems", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchWishlistItems({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.WISHLIST_ITEMS,
        lastId: pageParam as string,
        search,
      });
    },
    getNextPageParam: (lastPage) => {
      const products = lastPage?.data?.products || [];

      if (products.length > 0) {
        const lastProduct = products[products.length - 1];
        return lastProduct._id; // or `lastProduct.id` depending on your schema
      }

      // if (lastPage.data && lastPage.data.length > 0) {
      //   const lastItem = lastPage.data[lastPage.data.length - 1];
      //   return lastItem._id;
      // }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
