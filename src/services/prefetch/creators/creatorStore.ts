import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { getCreatorStoreQueryOptions } from "@/hooks/react-query/query-options/creators/creatorStore";
import { fetchCreatorStore } from "@/services/creators/creatorStore.service";
import { CreatorStore } from "@/types/creators/creatorStore";

export async function prefetchCreatorStoreData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchQuery(
    getCreatorStoreQueryOptions({
      locale: fallbackLocale,
      queryFn: () =>
        fetchCreatorStore({
          lang: fallbackLocale,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataResponse<CreatorStore>>(path);

            if (!ok || !data) {
              throw new Error(
                `[CreatorsDashboardPage] Failed to fetch creator's store: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
