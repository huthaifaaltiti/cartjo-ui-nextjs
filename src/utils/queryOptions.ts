import { PRODUCTS_COUNT_PER_SELECTED_CATEGORY } from "@/config/home.config";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { fetchActiveBanners } from "@/hooks/react-query/useBannersQuery";
import { fetchActiveCategories } from "@/hooks/react-query/useCategoriesQuery";
import { fetchCategory } from "@/hooks/react-query/useCategoryQuery";
import { fetchCategoriesPicks } from "@/hooks/react-query/useProductsQuery";
import { fetchActiveShowcases } from "@/hooks/react-query/useShowcasesQuery";
import { Locale } from "@/types/locale";

/**
 * Query options for banners (public data, always enabled)
 */
export const getActiveBannersQueryOptions = (locale: string | Locale) => ({
  queryKey: ["activeBanners", locale],
  queryFn: () => fetchActiveBanners({ lang: locale }),
  staleTime: STALE_TIME,
  /* 🚨 don’t block guests, banners are public => By default, if enabled: true, React Query will run the queryFn immediately (on mount, and on re-renders if dependencies like queryKey change). If enabled: false, the query won’t run until you manually call refetch(). */
  gcTime: GC_TIME,
  enabled: true,
});

/**
 * Query options for categories (public data, always enabled)
 */
export const getActiveCategoriesQueryOptions = (locale: string | Locale) => ({
  queryKey: ["activeCategories", locale],
  queryFn: () => fetchActiveCategories({ lang: locale }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
});

/**
 * Query options for showcases (server-side paginated)
 */
export const getActiveShowcasesQueryOptions = (limit: number) => ({
  queryKey: ["activeShowcases", limit],
  queryFn: () => fetchActiveShowcases(String(limit)),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});

/**
 * Query options for Categories Picks (public data, always enabled)
 */
export const getCategoriesPicksQueryOptions = (
  categoryId: string,
  locale: string | Locale,
  token: string
) => ({
  queryKey: ["categoriesPicks", locale, categoryId],
  queryFn: () =>
    fetchCategoriesPicks({
      token,
      lang: locale,
      limit: PRODUCTS_COUNT_PER_SELECTED_CATEGORY,
      categoryId,
    }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
});

/**
 * Query options for category
 */
export const getCategoryQueryOptions = (
  locale: Locale | string,
  categoryId: string
) => ({
  queryKey: ["publicCategory", locale, categoryId],
  queryFn: () => fetchCategory({ lang: locale, categoryId }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: !!categoryId,
});
