import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getActiveUsersQueryOptions } from "./query-options/activeUsers";
import { ActiveUsersResp, fetchActiveUsers } from "@/services/user.service";
import { authFetcher } from "@/utils/authFetcher";
import { useAuthContext } from "../useAuthContext";

export const useActiveUsersQuery = (search: string) => {
  const { isAuthenticated, isSessionLoading, userId, locale } =
    useAuthContext();

  return useInfiniteQuery<ActiveUsersResp>({
    ...getActiveUsersQueryOptions({
      search,
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchActiveUsers({
          lang: locale,
          limit: PAGINATION_LIMITS.ACTIVE_USERS,
          lastId: context?.pageParam as string,
          search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};
