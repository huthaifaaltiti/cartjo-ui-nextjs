import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Category } from "@/types/category.type";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Product } from "@/types/product.type";

interface FetchSubCategoryParams {
  lang?: Locale | string;
  subCategoryId: string;
}

export const fetchSubCategory = async ({
  lang = "en",
  subCategoryId,
}: FetchSubCategoryParams): Promise<DataResponse<Category>> => {
  const url = new URL(`${API_ENDPOINTS.SUB_CATEGORY.ONE}/${subCategoryId}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url.toString(), {});

  if (!res.ok) throw new Error("Could not retrieve sub-category");

  const resObj = await res.json();

  return resObj;
};

interface FetchSubCategoryProductsParams {
  lang?: string | Locale;
  categoryId: string;
  subCategoryId: string;
  limit?: number;
  lastId?: string;
  priceFrom?: number;
  priceTo?: number;
  ratingFrom?: number;
  createdFrom?: string;
  createdTo?: string;
  beforeNumOfDays?: number;
  accessToken?: string | undefined;
}

export const fetchSubCategoryProducts = async ({
  lang = "en",
  categoryId,
  subCategoryId,
  limit = PAGINATION_LIMITS.PUBLIC_SUB_CATEGORY_PRODUCTS_ITEMS,
  lastId,
  priceFrom,
  priceTo,
  ratingFrom,
  createdFrom,
  createdTo,
  beforeNumOfDays,
  accessToken
}: FetchSubCategoryProductsParams): Promise<DataListResponse<Product>> => {
  const url = new URL(`${API_ENDPOINTS.SUB_CATEGORY.PRODUCTS}`);

  if (lang) url.searchParams.append("lang", lang);
  if (categoryId) url.searchParams.append("categoryId", categoryId);
  if (subCategoryId) url.searchParams.append("subCategoryId", subCategoryId);
  if (limit) url.searchParams.append("limit", String(limit));
  if (lastId) url.searchParams.append("lastId", lastId);
  if (priceFrom !== undefined && priceFrom > 0)
    url.searchParams.append("priceFrom", String(priceFrom));
  if (priceTo !== undefined && priceTo > 0)
    url.searchParams.append("priceTo", String(priceTo));
  if (ratingFrom !== undefined && ratingFrom > 0)
    url.searchParams.append("ratingFrom", String(ratingFrom));
  if (createdFrom !== undefined && createdFrom)
    url.searchParams.append("createdFrom", String(createdFrom));
  if (createdTo !== undefined && createdTo)
    url.searchParams.append("createdTo", String(createdTo));
  if (beforeNumOfDays !== undefined && beforeNumOfDays > 0)
    url.searchParams.append("beforeNumOfDays", String(beforeNumOfDays));

  const res = await fetch(url.toString(), {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve sub-category's products");

  const resObj = await res.json();

  return resObj;
};

export const useSubCategoryQuery = (subCategoryId?: string) => {
  const { locale } = useAuthContext();

  return useQuery({
    queryKey: ["publicSubCategory", locale, subCategoryId],
    queryFn: () =>
      fetchSubCategory({ lang: locale, subCategoryId: subCategoryId! }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!subCategoryId,
  });
};

export const useSubCategoryProductsQuery = (
  categoryId: string,
  subCategoryId: string,
  priceFrom?: number,
  priceTo?: number,
  ratingFrom?: number,
  createdFrom?: string,
  createdTo?: string,
  beforeNumOfDays?: number
) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    queryKey: [
      "publicSubCategoryProducts",
      categoryId,
      subCategoryId,
      locale,
      priceFrom,
      priceTo,
      ratingFrom,
      createdFrom,
      createdTo,
      beforeNumOfDays,
    ],
    queryFn: ({ pageParam }) => {
      if (!categoryId) {
        throw new Error("No category id found");
      }

      return fetchSubCategoryProducts({
        lang: locale,
        categoryId,
        subCategoryId,
        limit: PAGINATION_LIMITS.PUBLIC_SUB_CATEGORY_PRODUCTS_ITEMS,
        lastId:
          pageParam && typeof pageParam === "string" ? pageParam : undefined,
        priceFrom,
        priceTo,
        ratingFrom,
        createdFrom,
        createdTo,
        beforeNumOfDays,
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
    enabled: !!categoryId && !!subCategoryId,
  });
};
