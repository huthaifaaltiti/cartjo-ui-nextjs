import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { CreatorStore } from "@/types/creators/creatorStore";
import { getPublicCreatorStoreQueryOptions } from "@/hooks/react-query/query-options/creators/publicCreatorStore";
import { fetchPublicCreatorStore } from "../creators/creatorStore.service";

export async function prefetchPublicCreatorStoreData({
  queryClient,
  handle,
  locale,
}: {
  queryClient: QueryClient;
  handle: string;
  locale: string;
}) {
  const cleanHandle = handle.replace(/^@/, "").toLowerCase().trim();

  try {
    await queryClient.prefetchQuery(
      getPublicCreatorStoreQueryOptions({
        locale: locale ?? Locale.EN,
        handle: cleanHandle,
        queryFn: () =>
          fetchPublicCreatorStore({
            handle: cleanHandle,
            lang: locale ?? Locale.EN,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataResponse<CreatorStore>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[PublicCreatorStorePage] Failed to fetch creator store: ${status}`,
                );
              }
              return data;
            },
          }),
      }),
    );
  } catch (error) {
    console.error("[PublicCreatorStorePage] Prefetch error:", error);
  }
}
