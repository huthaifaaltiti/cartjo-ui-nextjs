import { getActiveCategoriesQueryOptions } from "@/hooks/react-query/query-options/activeCategories";
import { QueryClient } from "@tanstack/react-query";
import {
  fetchActiveCategories,
  fetchCategoriesPicks,
} from "../category.service";
import { getActiveShowcasesQueryOptions } from "@/hooks/react-query/query-options/activeShowcases";
import { getActiveBannersQueryOptions } from "@/hooks/react-query/query-options/activeBanners";
import { Locale } from "@/enums/locale.enum";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Category } from "@/types/category.type";
import { apiFetch } from "@/lib/api.server";
import { fetchActiveShowcases } from "../showcase.service";
import { Showcase } from "@/types/showcase.type";
import { Banner } from "@/types/banner.type";
import { fetchActiveBanners } from "../banner.service";
import { getCategoriesPicksQueryOptions } from "@/hooks/react-query/query-options/categoryPicks";
import { Product } from "@/types/product.type";
import { Logo } from "@/types/logo";
import { getActiveLogoQueryOptions } from "@/hooks/react-query/query-options/activeLogo";
import { fetchActiveLogo } from "../logo.service";

export async function prefetchHomeData(
  queryClient: QueryClient,
  locale: string,
) {
  const [categoriesResult] = await Promise.all([
    queryClient.fetchQuery(
      getActiveCategoriesQueryOptions({
        locale: locale ?? Locale.EN,
        queryFn: () =>
          fetchActiveCategories({
            lang: locale ?? Locale.EN,
            fetcher: (path) =>
              apiFetch<DataListResponse<Category>>(path).then(
                ({ data, ok, status }) => {
                  if (!ok)
                    throw new Error(
                      `[HomePage] Failed to fetch active categories: ${status}`,
                    );
                  return data;
                },
              ),
          }),
      }),
    ),
    queryClient.prefetchQuery(
      getActiveShowcasesQueryOptions({
        locale: locale ?? Locale.EN,
        queryFn: () =>
          fetchActiveShowcases({
            lang: locale ?? Locale.EN,
            fetcher: (path) =>
              apiFetch<DataListResponse<Showcase>>(path).then(
                ({ data, ok, status }) => {
                  if (!ok)
                    throw new Error(
                      `[HomePage] Failed to fetch active showcases: ${status}`,
                    );
                  return data;
                },
              ),
          }),
      }),
    ),
    queryClient.prefetchQuery(
      getActiveBannersQueryOptions({
        locale: locale ?? Locale.EN,
        queryFn: () =>
          fetchActiveBanners({
            lang: locale ?? Locale.EN,
            fetcher: (path) =>
              apiFetch<DataListResponse<Banner>>(path).then(
                ({ data, ok, status }) => {
                  if (!ok)
                    throw new Error(
                      `[HomePage] Failed to fetch active banners: ${status}`,
                    );
                  return data;
                },
              ),
          }),
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
}) {
  await Promise.all(
    randomCategories.map((c: Category) =>
      queryClient.prefetchQuery(
        getCategoriesPicksQueryOptions({
          locale: locale ?? Locale.EN,
          categoryId: c._id,
          queryFn: () =>
            fetchCategoriesPicks({
              lang: locale ?? Locale.EN,
              categoryId: c._id,
              fetcher: (path) =>
                apiFetch<DataListResponse<Product>>(path).then(
                  ({ data, ok, status }) => {
                    if (!ok)
                      throw new Error(
                        `[HomePage] Failed to fetch active categories: ${status}`,
                      );
                    return data;
                  },
                ),
            }),
        }),
      ),
    ),
  );
}

export async function prefetchActiveLogo({
  queryClient,
  locale,
}: {
  locale: Locale | string;
  queryClient: QueryClient;
}) {
  await queryClient.prefetchQuery<DataResponse<Logo>>(
    getActiveLogoQueryOptions({
      locale: locale ?? Locale.EN,
      queryFn: () =>
        fetchActiveLogo({
          lang: locale ?? Locale.EN,
          fetcher: (path) =>
            apiFetch<DataResponse<Logo>>(path).then(({ data, ok, status }) => {
              if (!ok)
                throw new Error(
                  `[HomePage] Failed to fetch active logo: ${status}`,
                );
              return data;
            }),
        }),
    }),
  );
}
