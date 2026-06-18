import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { apiFetch } from "@/lib/api.server";
import { ActiveUsersResp, fetchAdminUsers } from "@/services/user.service";
import { getAdminUsersQueryOptions } from "@/hooks/react-query/query-options/adminUsers";

export async function prefetchAdminUsers({
  locale,
  queryClient,
}: {
  locale: string;
  queryClient: QueryClient;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.fetchInfiniteQuery(
    getAdminUsersQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: () =>
        fetchAdminUsers({
          lang: fallbackLocale,
          canManage: true,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<Promise<ActiveUsersResp>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedAdminUsers] Failed to fetch admin users: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
