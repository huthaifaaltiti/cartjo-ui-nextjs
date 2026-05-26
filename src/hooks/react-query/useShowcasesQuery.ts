import { useSession } from "next-auth/react";
import { useLocale } from "next-intl";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { CustomSession } from "@/lib/authOptions";
import { DataListResponse } from "@/types/service-response.type";
import { Showcase } from "@/types/showcase.type";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import { fetchActiveShowcases } from "@/services/showcase.service";
import { authFetcher } from "@/utils/authFetcher";
import { getActiveShowcasesQueryOptions } from "./query-options/activeShowcases";

interface FetchShowcasesParams {
  token: string | null;
  lang?: Locale | string;
  limit?: number;
  lastId?: string;
  search?: string;
}

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

  handleUnauthorizedResponse(res, lang);

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
  const { locale, isSessionLoading } = useAuthContext();

  return useQuery({
    ...getActiveShowcasesQueryOptions({
      locale,
      queryFn: () =>
        fetchActiveShowcases({
          lang: locale as Locale,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading,
  });
};
