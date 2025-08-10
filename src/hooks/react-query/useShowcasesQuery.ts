import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useInfiniteQuery } from "@tanstack/react-query";

import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";

import { DataListResponse } from "@/types/service-response.type";
import { Showcase } from "@/types/showcase.type";

interface FetchActiveShowcasesParams {
  token: string;
  lang?: string;
}

interface FetchShowcasesParams {
  token: string;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchActiveShowcases = async ({
  token,
  lang = "en",
}: FetchActiveShowcasesParams): Promise<DataListResponse<Showcase>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.SHOWCASES.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve active showcase(s)");

  const resObj = await res.json();

  return resObj;
};

export const fetchShowcases = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.SHOWCASES,
  lastId,
  search,
}: FetchShowcasesParams): Promise<DataListResponse<Showcase>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.SHOWCASES.ALL}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve showcases");

  const resObj = await res.json();

  return resObj;
};

export const useShowcasesQuery = ({ search }: { search: string }) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Showcase>>({
    queryKey: ["showcases", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchShowcases({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.SHOWCASES,
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

export const useActiveShowcasesQuery = () => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Showcase>>({
    queryKey: ["activeShowcases"],
    queryFn: () => {
      if (!accessToken) throw new Error("No access token found");

      return fetchActiveShowcases({
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
