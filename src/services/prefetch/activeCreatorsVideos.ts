import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { fetchActiveCreatorsVideos } from "@/services/creators/creatorsVideo.service";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";
import { getActiveCreatorsVideosQueryOptions } from "@/hooks/react-query/query-options/creators/dashboard/creatorsVideo";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";

export async function prefetchActiveCreatorsVideos({
  queryClient,
  locale,
  type = CreatorsVideoType.HERO,
}: {
  locale: string;
  type?: string;
  queryClient: QueryClient;
}): Promise<void> {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchQuery<DataResponse<CreatorsVideo[]>>(
    getActiveCreatorsVideosQueryOptions({
      locale: fallbackLocale,
      type,
      queryFn: async () => {
        return fetchActiveCreatorsVideos({
          lang: fallbackLocale,
          type,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataResponse<CreatorsVideo[]>>(path);

            if (!ok || !data) {
              throw new Error(
                `[CreatorsPage] Failed to fetch active creators videos: ${status}`,
              );
            }
            return data;
          },
        });
      },
    }),
  );
}
