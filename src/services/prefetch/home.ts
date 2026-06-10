import { getActiveCategoriesQueryOptions } from "@/hooks/react-query/query-options/activeCategories";
import { QueryClient } from "@tanstack/react-query";
import {
  fetchActiveCategories,
  fetchCategoriesPicks,
} from "../category.service";
import { getActiveShowcasesQueryOptions } from "@/hooks/react-query/query-options/activeShowcases";
import { getActiveBannersQueryOptions } from "@/hooks/react-query/query-options/activeBanners";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse } from "@/types/service-response.type";
import { Category } from "@/types/category.type";
import { apiFetch } from "@/lib/api.server";
import { fetchActiveShowcases } from "../showcase.service";
import { Showcase } from "@/types/showcase.type";
import { Banner } from "@/types/banner.type";
import { fetchActiveBanners } from "../banner.service";
import { getCategoriesPicksQueryOptions } from "@/hooks/react-query/query-options/categoryPicks";
import { Product } from "@/types/product.type";

export async function prefetchHomeData(
  queryClient: QueryClient,
  locale: string,
): Promise<Category[]> {
  const fallbackLocale = locale ?? Locale.EN;

  const [categoriesResult] = await Promise.all([
    queryClient.fetchQuery<DataListResponse<Category>>(
      getActiveCategoriesQueryOptions({
        locale: fallbackLocale,
        queryFn: async () => {
          return fetchActiveCategories({
            lang: fallbackLocale,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataListResponse<Category>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[HomePage] Failed to fetch active categories: ${status}`,
                );
              }
              return data;
            },
          });
        },
      }),
    ),
    queryClient.prefetchQuery<DataListResponse<Showcase>>(
      getActiveShowcasesQueryOptions({
        locale: fallbackLocale,
        queryFn: async () => {
          return fetchActiveShowcases({
            lang: fallbackLocale,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataListResponse<Showcase>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[HomePage] Failed to fetch active showcases: ${status}`,
                );
              }
              return data;
            },
          });
        },
      }),
    ),
    queryClient.prefetchQuery<DataListResponse<Banner>>(
      getActiveBannersQueryOptions({
        locale: fallbackLocale,
        queryFn: async () => {
          return fetchActiveBanners({
            lang: fallbackLocale,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataListResponse<Banner>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[HomePage] Failed to fetch active banners: ${status}`,
                );
              }
              return data;
            },
          });
        },
      }),
    ),
  ]);

  return categoriesResult?.data ?? [];
}

export async function prefetchCategoryPicks({
  randomCategories,
  queryClient,
  locale,
}: {
  randomCategories: Category[];
  locale: Locale | string;
  queryClient: QueryClient;
}): Promise<void> {
  const fallbackLocale = locale ?? Locale.EN;

  await Promise.all(
    randomCategories.map((c: Category) =>
      queryClient.prefetchQuery<DataListResponse<Product>>(
        getCategoriesPicksQueryOptions({
          locale: fallbackLocale,
          categoryId: c._id,
          queryFn: async () => {
            return fetchCategoriesPicks({
              lang: fallbackLocale,
              categoryId: c._id,
              fetcher: async (path) => {
                const { data, ok, status } =
                  await apiFetch<DataListResponse<Product>>(path);

                if (!ok || !data) {
                  throw new Error(
                    `[HomePage] Failed to fetch category picks: ${status}`,
                  );
                }
                return data;
              },
            });
          },
        }),
      ),
    ),
  );
}
