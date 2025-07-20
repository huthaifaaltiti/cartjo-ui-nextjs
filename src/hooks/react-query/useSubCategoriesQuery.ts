import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";

import { SubCategory } from "@/types/subCategory";

import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";

interface SubCategoriesResp {
  isSuccess: boolean;
  message: string;
  subCategoriesNum: number;
  subCategories: SubCategory[];
}

interface FetchSubCategoriesParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  catId?: string;
}

export const fetchSubCategories = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.TOTAL_USERS_LIMIT,
  lastId,
  search,
  catId,
}: FetchSubCategoriesParams): Promise<SubCategoriesResp> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.SUB_CATEGORIES.GET_ALL);

  if (limit) url.searchParams.append("limit", limit.toString());
  if (lastId) url.searchParams.append("lastId", lastId.toString());
  if (search) url.searchParams.append("search", search.toString());
  if (lang) url.searchParams.append("lang", lang.toString());
  if (catId) url.searchParams.append("catId", catId.toString());

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const resObj = await res.json();

  return resObj;
};

export const useSubCategoriesQuery = ({
  search,
  catId,
}: {
  search?: string;
  catId?: string;
}) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<SubCategoriesResp>({
    queryKey: ["subCategories", search, catId],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchSubCategories({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.TOTAL_SUB_CATEGORIES_LIMIT,
        lastId: pageParam as string,
        search,
        catId,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.subCategories && lastPage.subCategories.length > 0) {
        const lastSubCategory =
          lastPage.subCategories[lastPage.subCategories.length - 1];
        return lastSubCategory._id;
      }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
