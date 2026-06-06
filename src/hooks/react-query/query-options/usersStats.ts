import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UsersStats } from "@/types/UsersStats";

export const USERS_STATS_QUERY_KEY = "usersStats" as const;

interface UsersStatsResp {
  isSuccess: boolean;
  message: string;
  stats: UsersStats;
}

interface UsersStatsParams {
  locale: string | Locale;
  queryFn: (context: QueryFunctionContext) => Promise<UsersStatsResp>;
}

export const getUsersStatsQueryOptions = ({
  locale,
  queryFn,
}: UsersStatsParams) => {
  return {
    queryKey: [USERS_STATS_QUERY_KEY, locale],
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
