import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getCategoriesQueryOptions } from "@/hooks/react-query/query-options/categories";
import { fetchCategories } from "../category.service";
import { Category } from "@/types/category.type";

export async function prefetchAdminCategories({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getCategoriesQueryOptions({
      locale: fallbackLocale,
      search: "",
      queryFn: ({ pageParam }) =>
        fetchCategories({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.CATEGORIES,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<Category>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedCategories] Failed to fetch categories: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
