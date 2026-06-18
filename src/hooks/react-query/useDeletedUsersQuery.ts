import { QueryFunctionContext, useInfiniteQuery } from "@tanstack/react-query";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DeletedUsersResp, fetchDeletedUsers } from "@/services/user.service";
import { authFetcher } from "@/utils/authFetcher";
import { useAuthContext } from "../useAuthContext";
import { getDeletedUsersQueryOptions } from "./query-options/deletedUsers";

export const useDeletedUsersQuery = (search: string) => {
  const { isAuthenticated, isSessionLoading, userId, locale } =
    useAuthContext();

  return useInfiniteQuery<DeletedUsersResp>({
    ...getDeletedUsersQueryOptions({
      search,
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchDeletedUsers({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.DELETED_USERS,
          lastId: context?.pageParam as string,
          search,
          isDeleted: true,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};
