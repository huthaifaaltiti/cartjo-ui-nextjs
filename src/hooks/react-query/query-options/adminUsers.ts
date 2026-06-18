import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { ActiveUsersResp } from "@/services/user.service";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";

export const ADMIN_USERS_QUERY_KEY = "adminUsers" as const;

export const getAdminUsersQueryOptions = ({
  search,
  locale,
  queryFn,
}: {
  search: string;
  locale: Locale | string;
  queryFn: (context: QueryFunctionContext) => Promise<ActiveUsersResp>;
}) => {
  return {
    queryKey: [ADMIN_USERS_QUERY_KEY, search, locale],
    queryFn,
    getNextPageParam: (lastPage: ActiveUsersResp) => {
      const lastUser = lastPage.users[lastPage.users.length - 1];

      return lastUser ? lastUser._id : undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
