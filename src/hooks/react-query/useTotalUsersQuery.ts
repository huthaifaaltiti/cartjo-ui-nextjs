import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";

import { User } from "@/types/user";

import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";

interface TotalUsersResp {
  isSuccess: boolean;
  message: string;
  users: User[];
}

interface FetchUsersParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchTotalUsers = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.TOTAL_USERS_LIMIT,
  lastId,
  search,
}: FetchUsersParams): Promise<TotalUsersResp> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.USERS.GET_TOTAL_USERS);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve total users");

  const resObj = await res.json();

  return resObj;
};

export const useTotalUsersQuery = (search?: string) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<TotalUsersResp>({
    queryKey: ["totalUsers", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchTotalUsers({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.TOTAL_USERS_LIMIT,
        lastId: pageParam as string,
        search,
      });
    },
    getNextPageParam: (lastPage) => {
      // Return the _id of the last user for pagination
      if (lastPage.users && lastPage.users.length > 0) {
        const lastUser = lastPage.users[lastPage.users.length - 1];
        return lastUser._id;
      }
      return undefined; // No more pages
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
