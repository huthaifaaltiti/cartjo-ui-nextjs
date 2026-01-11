import { PRODUCTS_COUNT_PER_SELECTED_CATEGORY } from "@/config/home.config";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { fetchActiveBanners } from "@/hooks/react-query/useBannersQuery";
import { fetchCartItems } from "@/hooks/react-query/useCartQuery";
import { fetchActiveCategories } from "@/hooks/react-query/useCategoriesQuery";
import {
  fetchCategory,
  fetchCategoryProducts,
} from "@/hooks/react-query/useCategoryQuery";
import { fetchStaticNationalist } from "@/hooks/react-query/useNationalityQuery";
import { fetchOrders } from "@/hooks/react-query/useOrdersQuery";
import {
  fetchProduct,
  fetchProductComments,
} from "@/hooks/react-query/useProductQuery";
import { fetchCategoriesPicks } from "@/hooks/react-query/useProductsQuery";
import { fetchSearchProducts } from "@/hooks/react-query/useSearchQuery";
import { fetchActiveShowcases } from "@/hooks/react-query/useShowcasesQuery";
import { fetchSubCategoryProducts } from "@/hooks/react-query/useSubCategoryQuery";
import { fetchSuggestedProducts } from "@/hooks/react-query/useSuggestedProductQuery";
import { fetchUserOrderReturns } from "@/hooks/react-query/useUserOrderReturnsQuery";
import { fetchUserOrders } from "@/hooks/react-query/useUserOrdersQuery";
import { fetchMyProfile } from "@/hooks/react-query/useUserProfileQuery";
import { fetchWishlistItems } from "@/hooks/react-query/useWishlistQuery";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Cart } from "@/types/cart.type";
import { Comment } from "@/types/comment.type";
import { FetchError } from "@/types/common";
import { Locale } from "@/types/locale";
import { Order } from "@/types/order.type";
import { Product } from "@/types/product.type";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { QueryFunctionContext } from "@tanstack/react-query";

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

export const getCategoryProductsQueryOptions = (
  locale: string,
  categoryId: string
) => {
  const getNextPageParam = (lastPage: DataListResponse<Product>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: ["publicCategoryProducts", categoryId, locale],
    /* From: { pageParam }: { pageParam: string } To: { pageParam }: { pageParam: unknown } => The issue is that React Query's prefetchInfiniteQuery expects the queryFn to accept the full query context object, not just the destructured pageParam
    1. Changed the pageParam type from string | undefined to unknown - This matches React Query's expected type for infinite queries
    2. Simplified the type guard - Since pageParam is unknown, we just need to check if it's a string
    */
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      if (!categoryId) {
        throw new Error("No category id found");
      }

      return fetchCategoryProducts({
        lang: locale,
        categoryId,
        limit: PAGINATION_LIMITS.PUBLIC_CATEGORY_PRODUCTS_ITEMS,
        lastId: typeof pageParam === "string" ? pageParam : undefined,
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!categoryId,
  };
};

export const getSubCategoryProductsQueryOptions = (
  locale: string,
  categoryId: string,
  subCategoryId: string
) => {
  const { accessToken } = useAuthContext();

  const getNextPageParam = (lastPage: DataListResponse<Product>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: ["publicSubCategoryProducts", categoryId, locale, subCategoryId, accessToken],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      if (!categoryId || !subCategoryId) {
        throw new Error("No category or subCategory id found");
      }

      return fetchSubCategoryProducts({
        lang: locale,
        categoryId,
        subCategoryId,
        limit: PAGINATION_LIMITS.PUBLIC_SUB_CATEGORY_PRODUCTS_ITEMS,
        lastId: typeof pageParam === "string" ? pageParam : undefined
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!categoryId && !!subCategoryId,
  };
};

export const getProductQueryOptions = (
  locale: string | Locale,
  productId: string,
  token: string | null
) => {
  return {
    queryKey: ["publicProduct", locale, productId, token],
    queryFn: () => fetchProduct({ lang: locale, productId, token }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!token || !!productId,
    retry: (failureCount: number, error: Error) => {
      const err = error as FetchError;
      if (err?.status === 404) return false;
      return failureCount < 2; // Only retry up to 2 times for other errors
    },
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  };
};

export const getSearchProductsQueryOptions = (
  locale: string,
  querySearch: string
) => {
  const getNextPageParam = (lastPage: DataListResponse<Product>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: ["publicSearchProducts", locale, querySearch],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      if (!querySearch) throw new Error("No query search is found");

      return fetchSearchProducts({
        querySearch,
        lang: locale,
        limit: PAGINATION_LIMITS.PUBLIC_SEARCH_PRODUCTS_ITEMS,
        lastId: typeof pageParam === "string" ? pageParam : undefined,
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!querySearch,
  };
};

export const getSearchProductCommentsQueryOptions = (
  locale: string,
  productId: string
) => {
  const getNextPageParam = (lastPage: DataListResponse<Comment>) => {
    if (!lastPage?.data?.length) return undefined;

    const lastProduct = lastPage.data[lastPage.data.length - 1];
    return lastProduct?._id || undefined;
  };

  return {
    queryKey: ["publicSearchProductComments", locale, productId],
    queryFn: async ({ pageParam }: { pageParam: unknown }) => {
      if (!productId) throw new Error("No productId is found");

      return fetchProductComments({
        lang: locale,
        limit: PAGINATION_LIMITS.PUBLIC_PRODUCT_COMMENTS_ITEMS,
        lastId: typeof pageParam === "string" ? pageParam : undefined,
        productId,
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!productId,
  };
};

export const getSuggestedProductsQueryOptions = (
  locale: Locale | string,
  limit: number
) => ({
  queryKey: ["suggestedPublicCategory", locale, limit],
  queryFn: () => fetchSuggestedProducts({ lang: locale, limit }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
  // retry: (failureCount, error) => {
  //   const err = error as FetchError;
  //   if (err?.status === 404) return false;
  //   return failureCount < 2; // Only retry up to 2 times for other errors
  // },
  // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

export const getUserProfileQueryOptions = (
  locale: Locale | string,
  userId: string,
  token: string
) => ({
  queryKey: ["userProfileData", locale, userId],
  queryFn: () =>
    fetchMyProfile({
      token,
      lang: locale,
      userId,
    }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: !!userId,
});

export const getStaticNationalityListQueryOptions = (
  locale: Locale | string,
  token: string
) => ({
  queryKey: ["staticNationalityList", locale],
  queryFn: () =>
    fetchStaticNationalist({
      token,
      lang: locale,
    }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
});

export const getCartQueryOptions = (token: string) => {
  const getNextPageParam = (lastPage: DataResponse<Cart>) => {
    if (!lastPage?.data?.items?.length) return undefined;

    const lastProduct = lastPage.data.items.at(-1);
    return lastProduct?._id ?? undefined;
  };

  return {
    queryKey: ["cartItems", token],
    queryFn: () =>
      fetchCartItems({
        token,
        lang: "en",
        limit: PAGINATION_LIMITS.CART_ITEMS,
      }),
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};

export const getWishlistQueryOptions = (token: string) => {
  const getNextPageParam = (lastPage: DataResponse<Cart>) => {
    if (!lastPage?.data?.items?.length) return undefined;

    const lastProduct = lastPage.data.items.at(-1);
    return lastProduct?._id ?? undefined;
  };

  return {
    queryKey: ["wishlistItems", ""],
    queryFn: () =>
      fetchWishlistItems({
        token,
        lang: "en",
        limit: PAGINATION_LIMITS.WISHLIST_ITEMS,
      }),
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};

export const getOrdersQueryOptions = (token: string) => {
  const getNextPageParam = (lastPage: DataResponse<Cart>) => {
    if (!lastPage?.data?.items?.length) return undefined;

    const lastProduct = lastPage.data.items.at(-1);
    return lastProduct?._id ?? undefined;
  };

  return {
    queryKey: ["orders"],
    queryFn: () =>
      fetchOrders({
        token,
        lang: "en",
        limit: PAGINATION_LIMITS.ORDERS,
      }),
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};

export const getUserOrdersQueryOptions = (
  locale: Locale | string,
  token: string,
  uid: string,
  search?: string
) => {
  const getNextPageParam = (lastPage: DataListResponse<Order>) => {
    if (!lastPage?.data?.length) return undefined;
    const lastOrder = lastPage.data[lastPage.data.length - 1];
    return lastOrder?._id || undefined;
  };

  return {
    queryKey: ["userOrders", locale, token, uid, search] as const,
    queryFn: async (context: QueryFunctionContext) => {
      const pageParam = context.pageParam as string | undefined;

      if (!token) throw new Error("Not authorized");
      if (!uid) throw new Error("No user id");

      return fetchUserOrders({
        token,
        lang: locale,
        uid,
        limit: PAGINATION_LIMITS.USER_ORDERS,
        lastId: pageParam,
        search,
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!token,
  };
};

export const getUserOrderReturnsQueryOptions = (
  locale: Locale | string,
  token: string,
  uid: string,
  search?: string
) => {
  const getNextPageParam = (lastPage: DataListResponse<Order>) => {
    if (!lastPage?.data?.length) return undefined;
    const lastOrder = lastPage.data[lastPage.data.length - 1];
    return lastOrder?._id || undefined;
  };

  return {
    queryKey: ["userOrderReturns", locale, token, uid, search] as const,
    queryFn: async (context: QueryFunctionContext) => {
      const pageParam = context.pageParam as string | undefined;

      if (!token) throw new Error("Not authorized");
      if (!uid) throw new Error("No user id");

      return fetchUserOrderReturns({
        token,
        lang: locale,
        uid,
        limit: PAGINATION_LIMITS.USER_ORDER_RETURNS,
        lastId: pageParam,
        search,
      });
    },
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!token,
  };
};
