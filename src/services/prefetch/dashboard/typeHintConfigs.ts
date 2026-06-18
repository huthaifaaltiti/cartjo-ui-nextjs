import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { fetchTypeHintConfigs } from "@/services/typeHintConfig.service";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import { getTypeHintConfigsQueryOptions } from "@/hooks/react-query/query-options/typeHintConfigs";

export async function prefetchDashboardTypeHintConfigsData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getTypeHintConfigsQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: ({ pageParam }) =>
        fetchTypeHintConfigs({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.SHOWCASES ?? 20,
          search: "",
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<TypeHintConfig>>(path);

            if (!ok || !data) {
              throw new Error(`Failed to fetch type-hint configs: ${status}`);
            }
            return data;
          },
        }),
    }),
  );
}
