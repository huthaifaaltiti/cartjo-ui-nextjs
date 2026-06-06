import { useQuery } from "@tanstack/react-query";
import { UsersStats } from "@/types/UsersStats";
import { getUsersStatsQueryOptions } from "./query-options/dashboard/usersStats";
import { useAuthContext } from "../useAuthContext";
import { fetchUsersStats } from "@/services/user.service";
import { authFetcher } from "@/utils/authFetcher";

interface UsersStatsResp {
  isSuccess: boolean;
  message: string;
  stats: UsersStats;
}

export const useUsersStats = () => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useQuery<UsersStatsResp>({
    ...getUsersStatsQueryOptions({
      locale,
      queryFn: () =>
        fetchUsersStats({ lang: locale, fetcher: (path) => authFetcher(path) }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};
