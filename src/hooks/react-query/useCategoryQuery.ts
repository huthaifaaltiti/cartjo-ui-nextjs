import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Category } from "@/types/category.type";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";

interface FetchCategoryParams {
  lang?: Locale | string;
  categoryId: string;
}

export const fetchCategory = async ({
  lang = "en",
  categoryId,
}: FetchCategoryParams): Promise<DataResponse<Category>> => {
  const url = new URL(`${API_ENDPOINTS.CATEGORY.ONE}/${categoryId}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url.toString(), {});

  if (!res.ok) throw new Error("Could not retrieve category");

  const resObj = await res.json();

  return resObj;
};

interface FetchCategoryProductsParams {
  lang?: string | Locale;
  categoryId: string;
  limit?: number;
  lastId?: string;
}

export const fetchCategoryProducts = async ({
  lang = "en",
  categoryId,
  limit = PAGINATION_LIMITS.PUBLIC_CATEGORY_PRODUCTS_ITEMS,
  lastId,
}: FetchCategoryProductsParams): Promise<DataListResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.CATEGORY.PRODUCTS}`);

  if (lang) url.searchParams.append("lang", lang);
  if (categoryId) url.searchParams.append("categoryId", categoryId);
  if (limit) url.searchParams.append("limit", String(limit));
  if (lastId) url.searchParams.append("lastId", lastId);

  const res = await fetch(url.toString(), {});

  if (!res.ok) throw new Error("Could not retrieve category's products");

  const resObj = await res.json();

  return resObj;
};

export const useCategoryQuery = (categoryId?: string) => {
  const { locale } = useAuthContext();

  return useQuery({
    queryKey: ["publicCategory", locale, categoryId],
    queryFn: () => fetchCategory({ lang: locale, categoryId: categoryId! }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!categoryId, // only run if id exists
  });
};

// export const useCategoryProductsQuery = (categoryId: string) => {
//   const { locale } = useAuthContext();

//   return useInfiniteQuery(getCategoryProductsQueryOptions(locale, categoryId));
// };

export const useCategoryProductsQuery = (categoryId: string) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    queryKey: ["publicCategoryProducts", categoryId, locale],
    queryFn: ({ pageParam }) => {
      if (!categoryId) {
        throw new Error("No category id found");
      }

      return fetchCategoryProducts({
        lang: locale,
        categoryId,
        limit: PAGINATION_LIMITS.PUBLIC_CATEGORY_PRODUCTS_ITEMS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
      });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.length) return undefined;

      const lastProduct = lastPage.data[lastPage.data.length - 1];
      return lastProduct?._id || undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!categoryId,
  });
};
