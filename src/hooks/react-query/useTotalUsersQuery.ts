import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { User } from "@/types/user";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getTotalUsersQueryOptions } from "./query-options/totalUsers";
import { fetchTotalUsers } from "@/services/user.service";
import { authFetcher } from "@/utils/authFetcher";
import { useAuthContext } from "../useAuthContext";

interface TotalUsersResp {
  isSuccess: boolean;
  message: string;
  usersNum: number;
  users: User[];
}

export const useTotalUsersQuery = (search: string) => {
  const { isAuthenticated, isSessionLoading, userId, locale } =
    useAuthContext();

  return useInfiniteQuery<TotalUsersResp>({
    ...getTotalUsersQueryOptions({
      search,
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchTotalUsers({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.TOTAL_USERS,
          lastId: context?.pageParam as string,
          search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};
