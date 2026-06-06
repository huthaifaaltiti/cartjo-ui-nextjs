import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getShowcasesQueryOptions } from "@/hooks/react-query/query-options/showcases";
import { fetchShowcases } from "@/services/showcase.service";
import { Showcase } from "@/types/showcase.type";

export async function prefetchDashboardShowcasesData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getShowcasesQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: ({ pageParam }) =>
        fetchShowcases({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.SHOWCASES ?? 20,
          search: "",
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<Showcase>>(path);

            if (!ok || !data) {
              throw new Error(
                `Failed to fetch showcases: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
