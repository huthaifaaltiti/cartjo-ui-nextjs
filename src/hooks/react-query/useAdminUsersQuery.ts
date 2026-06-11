import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { AdminUsersResp, fetchAdminUsers } from "@/services/user.service";
import { getAdminUsersQueryOptions } from "./query-options/adminUsers";
import { authFetcher } from "@/utils/authFetcher";
import { useAuthContext } from "../useAuthContext";

export const useAdminUsersQuery = (search: string) => {
  const { isAuthenticated, isSessionLoading, userId, locale } =
    useAuthContext();

  return useInfiniteQuery<AdminUsersResp>({
    ...getAdminUsersQueryOptions({
      search,
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchAdminUsers({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.ADMIN_USERS,
          lastId: context?.pageParam as string,
          search,
          canManage: true,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};
