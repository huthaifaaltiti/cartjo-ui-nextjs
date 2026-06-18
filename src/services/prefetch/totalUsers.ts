import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { apiFetch } from "@/lib/api.server";
import { fetchTotalUsers, TotalUsersResp } from "@/services/user.service";
import { getTotalUsersQueryOptions } from "@/hooks/react-query/query-options/totalUsers";

export async function prefetchTotalUsers({
  locale,
  queryClient,
}: {
  locale: string;
  queryClient: QueryClient;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.fetchInfiniteQuery(
    getTotalUsersQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: () =>
        fetchTotalUsers({
          lang: fallbackLocale,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<Promise<TotalUsersResp>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedTotalUsers] Failed to fetch dashboard total users: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
