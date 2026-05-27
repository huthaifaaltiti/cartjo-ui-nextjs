import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Category } from "@/types/category.type";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { Product } from "@/types/product.type";
import { getSubCategoryProductsQueryOptions } from "./query-options/subCategoryProducts";
import { authFetcher } from "@/utils/authFetcher";
import { fetchSubCategoryProducts } from "@/services/subCategory.service";

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
  beforeNumOfDays?: number,
) => {
  const { locale } = useAuthContext();

  return useInfiniteQuery<DataListResponse<Product>>({
    ...getSubCategoryProductsQueryOptions({
      categoryId,
      subCategoryId,
      priceFrom,
      priceTo,
      ratingFrom,
      createdFrom,
      createdTo,
      beforeNumOfDays,
      locale,
      queryFn: ({ pageParam }) =>
        fetchSubCategoryProducts({
          lang: locale as Locale,
          categoryId,
          subCategoryId,
          priceFrom,
          lastId: pageParam as string,
          priceTo,
          ratingFrom,
          createdFrom,
          createdTo,
          beforeNumOfDays,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
