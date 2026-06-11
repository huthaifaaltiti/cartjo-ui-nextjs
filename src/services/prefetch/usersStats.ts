import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { apiFetch } from "@/lib/api.server";
import { fetchUsersStats, UsersStatsResp } from "@/services/user.service";
import { getUsersStatsQueryOptions } from "@/hooks/react-query/query-options/usersStats";

export async function prefetchUsersStats({
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
