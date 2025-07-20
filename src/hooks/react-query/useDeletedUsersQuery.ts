import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";

import { CustomSession } from "@/lib/authOptions";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { User } from "@/types/user";

interface ActiveUsersResp {
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
  isDeleted?: boolean;
}

export const fetchDeletedUsers = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.TOTAL_USERS_LIMIT,
  lastId,
  search,
  isDeleted,
}: FetchUsersParams): Promise<ActiveUsersResp> => {
  const url = new URL(
    `${API_ENDPOINTS.DASHBOARD.USERS.GET_DELETED_USERS}`
  );

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);
  if (typeof isDeleted === "boolean")
    url.searchParams.append("isDeleted", isDeleted.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve deleted users");

  const resObj = await res.json();

  return resObj;
};

export const useDeletedUsersQuery = (search?: string) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<ActiveUsersResp>({
    queryKey: ["deletedUsers", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchDeletedUsers({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.INITIAL_DELETED_USERS_LIMIT,
        lastId: pageParam as string,
        search,
        isDeleted: true,
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
