import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";

import { CustomSession } from "@/lib/authOptions";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { User } from "@/types/user";

interface AdminUsersResp {
  isSuccess: boolean;
  message: string;
  usersNum: number;
  users: User[];
}

interface FetchUsersParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  canManage?: boolean;
}

export const fetchAdminUsers = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.TOTAL_USERS_LIMIT,
  lastId,
  search,
  canManage,
}: FetchUsersParams): Promise<AdminUsersResp> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.USERS.GET_ADMIN_USERS}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);
  if (typeof canManage === "boolean")
    url.searchParams.append("canManage", canManage.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve admin users");

  const resObj = await res.json();

  return resObj;
};

export const useAdminUsersQuery = (search?: string) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<AdminUsersResp>({
    queryKey: ["adminUsers", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchAdminUsers({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.INITIAL_ADMIN_USERS_LIMIT,
        lastId: pageParam as string,
        search,
        canManage: true,
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
