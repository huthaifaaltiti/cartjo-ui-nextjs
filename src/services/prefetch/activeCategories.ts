import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { fetchActiveCategories } from "../category.service";
import { Category } from "@/types/category.type";
import { getActiveCategoriesQueryOptions } from "@/hooks/react-query/query-options/activeCategories";

export async function prefetchAdminActiveCategories({
  queryClient,
  locale,
}: {
  queryClient: QueryClient;
  locale: string;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchQuery(
    getActiveCategoriesQueryOptions({
      locale: fallbackLocale,
      queryFn: () =>
        fetchActiveCategories({
          lang: fallbackLocale,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataListResponse<Category>>(path);

            if (!ok || !data) {
              throw new Error(
                `[PrefetchedActiveCategories] Failed to fetch active categories: ${status}`,
              );
            }
            return data;
          },
        }),
    }),
  );
}
