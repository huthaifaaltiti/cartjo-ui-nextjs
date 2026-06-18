import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { apiFetch } from "@/lib/api.server";
import { ActiveUsersResp, fetchDeletedUsers } from "@/services/user.service";
import { getDeletedUsersQueryOptions } from "@/hooks/react-query/query-options/deletedUsers";

export async function prefetchDeletedUsers({
  locale,
  queryClient,
}: {
  locale: string;
  queryClient: QueryClient;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.fetchInfiniteQuery(
    getDeletedUsersQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: () =>
        fetchDeletedUsers({
          lang: fallbackLocale,
          isDeleted: true,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<Promise<ActiveUsersResp>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedDeletedUsers] Failed to fetch deleted users: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
