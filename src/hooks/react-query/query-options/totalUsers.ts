import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { TotalUsersResp } from "@/services/user.service";

export const TOTAL_USERS_QUERY_KEY = "totalUsers" as const;

export const getTotalUsersQueryOptions = ({
  search,
  locale,
  queryFn,
}: {
  search: string;
  locale: Locale | string;
  queryFn: (context: QueryFunctionContext) => Promise<TotalUsersResp>;
}) => {
  return {
    queryKey: [TOTAL_USERS_QUERY_KEY, search, locale],
    queryFn,
    getNextPageParam: (lastPage: TotalUsersResp) => {
      const lastUser = lastPage.users[lastPage.users.length - 1];

      return lastUser ? lastUser._id : undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
