import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { getSubCategoriesQueryOptions } from "@/hooks/react-query/query-options/subCategories";
import { fetchSubCategories } from "../subCategory.service";
import { SubCategory } from "@/types/subCategory";

export async function prefetchAdminSubCategories({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchInfiniteQuery(
    getSubCategoriesQueryOptions({
      locale: fallbackLocale,
      search: "",
      catId: undefined,
      queryFn: ({ pageParam }) =>
        fetchSubCategories({
          lang: fallbackLocale,
          lastId: pageParam as string,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.SUB_CATEGORIES,
          search: "",
          catId: undefined,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<SubCategory>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedSubCategories] Failed to fetch sub-categories: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
