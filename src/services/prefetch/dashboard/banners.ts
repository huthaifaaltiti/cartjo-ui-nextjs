import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getBannersQueryOptions } from "@/hooks/react-query/query-options/banners";
import { fetchBanners } from "@/services/banner.service";
import { Banner } from "@/types/banner.type";

export async function prefetchDashboardBannersData({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  await queryClient.prefetchInfiniteQuery(
    getBannersQueryOptions({
      locale: locale ?? Locale.EN,
      search: "",
      queryFn: ({ pageParam }) =>
        fetchBanners({
          lang: locale ?? Locale.EN,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.BANNERS ?? 20,
          fetcher: (path) =>
            apiFetch<DataListResponse<Banner>>(path).then(
              ({ data, ok, status }) => {
                if (!ok)
                  throw new Error(
                    `[DashboardBannersPage] Failed to fetch dashboard banners: ${status}`,
                  );
                return data;
              },
            ),
        }),
    }),
  );
}
