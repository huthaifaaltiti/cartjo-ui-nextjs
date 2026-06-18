import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { apiFetch } from "@/lib/api.server";
import { ActiveUsersResp, fetchActiveUsers } from "@/services/user.service";
import { getActiveUsersQueryOptions } from "@/hooks/react-query/query-options/activeUsers";

export async function prefetchActiveUsers({
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
