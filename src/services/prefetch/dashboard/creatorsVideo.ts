import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getCreatorsVideosQueryOptions } from "@/hooks/react-query/query-options/creatorsVideo";
import { fetchCreatorsVideos } from "@/services/creatorsVideo.service";
import { CreatorsVideo } from "@/types/creatorsVideo";

export async function prefetchDashboardCreatorsVideosData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getCreatorsVideosQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: ({ pageParam }) =>
        fetchCreatorsVideos({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.CREATORS_VIDEOS ?? 10,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<CreatorsVideo>>(path);

            if (!ok || !data) {
              throw new Error(
                `[DashboardCreatorsVideosPage] Failed to fetch creators videos: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
