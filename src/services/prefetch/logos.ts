import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getLogosQueryOptions } from "@/hooks/react-query/query-options/logos";
import { fetchLogos } from "@/services/logo.service";
import { Logo } from "@/types/logo";

export async function prefetchDashboardLogosData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getLogosQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: ({ pageParam }) =>
        fetchLogos({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.BANNERS ?? 20,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<Logo>>(path);

            if (!ok || !data) {
              throw new Error(
                `[DashboardLogosPage] Failed to fetch dashboard logos: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
