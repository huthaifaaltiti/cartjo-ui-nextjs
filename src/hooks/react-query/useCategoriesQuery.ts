import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";

import { Category } from "@/types/category";
import { DataListResponse } from "@/types/service-response.type";

import { CustomSession } from "@/lib/authOptions";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

interface FetchCategoriesParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchCategories = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.CATEGORIES,
  lastId,
  search,
}: FetchCategoriesParams): Promise<DataListResponse<Category>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.CATEGORIES.GET_ALL}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve categories");

  const resObj = await res.json();

  return resObj;
};

export const useCategoriesQuery = (search?: string) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Category>>({
    queryKey: ["categories", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchCategories({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.CATEGORIES,
        lastId: pageParam as string,
        search,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data && lastPage.data.length > 0) {
        const lastCategory = lastPage.data[lastPage.data.length - 1];
        return lastCategory._id;
      }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
