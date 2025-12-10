import { useInfiniteQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { Logo } from "@/types/logo";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { CustomSession } from "@/lib/authOptions";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";

interface FetchLogosParams {
  token: string | null;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchLogos = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.LOGOS,
  lastId,
  search,
}: FetchLogosParams): Promise<DataListResponse<Logo>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.LOGOS.ALL}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve logos");

  const resObj = await res.json();

  return resObj;
};

export const fetchActiveLogo = async ({
  token,
  lang = "en",
}: FetchLogosParams): Promise<DataResponse<Logo>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.LOGOS.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Could not retrieve active logo");

  const resObj = await res.json();

  return resObj;
};

export const useLogosQuery = (search?: string) => {
  const { data: session } = useSession();
  const locale = useLocale();
  const accessToken = (session as CustomSession)?.accessToken;

  return useInfiniteQuery<DataListResponse<Logo>>({
    queryKey: ["logos", search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchLogos({
        token: accessToken,
        lang: locale,
        limit: PAGINATION_LIMITS.LOGOS,
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
