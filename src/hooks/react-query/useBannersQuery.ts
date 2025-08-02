import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";

import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";

import { Banner } from "@/types/banner.type";
import { DataListResponse } from "@/types/service-response.type";

interface FetchActiveBannersParams {
  token: string;
  lang?: string;
}

interface FetchBannersParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchActiveBanners = async ({
  token,
  lang = "en",
}: FetchActiveBannersParams): Promise<DataListResponse<Banner>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.BANNERS.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve active banner(s)");

  const resObj = await res.json();

  return resObj;
};

export const fetchBanners = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.BANNERS,
  lastId,
  search,
}: FetchBannersParams): Promise<DataListResponse<Banner>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.BANNERS.ALL}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve banners");

  const resObj = await res.json();

  return resObj;
};

export const useBannersQuery = ({ search }: { search: string }) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Banner>>({
    queryKey: ["banners", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchBanners({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.BANNERS,
        lastId: pageParam as string,
        search,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data && lastPage.data.length > 0) {
        const lastItem = lastPage.data[lastPage.data.length - 1];
        return lastItem._id;
      }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};

export const useActiveBannersQuery = () => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Banner>>({
    queryKey: ["activeBanners"],
    queryFn: () => {
      if (!accessToken) throw new Error("No access token found");

      return fetchActiveBanners({
        token: accessToken,
        lang: locale,
      });
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data && lastPage.data.length > 0) {
        const lastItem = lastPage.data[lastPage.data.length - 1];
        return lastItem._id;
      }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
