import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { apiFetch } from "@/lib/api.server";
import { getUsersStatsQueryOptions } from "@/hooks/react-query/query-options/dashboard/usersStats";
import {
  ActiveUsersResp,
  fetchActiveUsers,
  fetchUsersStats,
  UsersStatsResp,
} from "@/services/user.service";
import { getActiveUsersQueryOptions } from "@/hooks/react-query/query-options/dashboard/activeUsers";

export async function prefetchDashboardUsersData({
  locale,
  queryClient,
}: {
  locale: string;
  queryClient: QueryClient;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.fetchQuery(
    getUsersStatsQueryOptions({
      locale: fallbackLocale,
      queryFn: () =>
        fetchUsersStats({
          lang: fallbackLocale,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<Promise<UsersStatsResp>>(path);

            if (!ok || !data) {
              throw new Error(
                `[DashboardUsersPage] Failed to fetch dashboard users statistics: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}

export async function prefetchDashboardActiveUsersData({
  locale,
  queryClient,
}: {
  locale: string;
  queryClient: QueryClient;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.fetchInfiniteQuery(
    getActiveUsersQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: () =>
        fetchActiveUsers({
          lang: fallbackLocale,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<Promise<ActiveUsersResp>>(path);

            if (!ok || !data) {
              throw new Error(
                `[DashboardActiveUsersPage] Failed to fetch dashboard active users: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
