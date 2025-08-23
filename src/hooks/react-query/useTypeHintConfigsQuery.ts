import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { DataListResponse } from "@/types/service-response.type";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { handleUnauthorizedResponse } from "@/utils/handleUnauthorizedResponse";
import { useTypeHintConfig } from "@/contexts/TypeHintConfig.context";

interface FetchTypeHintConfigsParams {
  token: string | null;
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
}

export const fetchTypeHintConfigs = async ({
  token,
  lang = "en",
  limit = PAGINATION_LIMITS.TYPE_HINT_CONFIGS,
  lastId,
  search,
}: FetchTypeHintConfigsParams): Promise<DataListResponse<TypeHintConfig>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.ALL}`);

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

  if (!res.ok) throw new Error("Could not retrieve type-hint configs");

  const resObj = await res.json();

  return resObj;
};

export const fetchTypeHintConfigsList = async (
  token: string,
  lang: Locale | string
) => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.LIST}`);

  if (lang) url.searchParams.append("lang", lang);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  handleUnauthorizedResponse(res, lang);

  if (!res.ok)
    throw new Error("Could not retrieve active type-hint config list");

  const resObj = await res.json();

  return resObj.data;
};

export const fetchActiveTypeHintConfigs = async (
  token: string,
  lang: Locale | string,
  limit = PAGINATION_LIMITS.TYPE_HINT_CONFIGS
) => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.LIST}`);

  if (lang) url.searchParams.append("lang", lang);
  if (limit) url.searchParams.append("limit", String(limit));

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  handleUnauthorizedResponse(res, lang);

  if (!res.ok)
    throw new Error("Could not retrieve active type-hint config list");

  const resObj = await res.json();

  return resObj.data;
};

export const useTypeHintConfigsQuery = ({ search }: { search: string }) => {
  const { accessToken, locale } = useAuthContext();
  const { queryKey } = useTypeHintConfig();

  return useInfiniteQuery<DataListResponse<TypeHintConfig>>({
    queryKey: [queryKey, search],
    queryFn: ({ pageParam }) => {
      if (!accessToken) throw new Error("No access token found");

      return fetchTypeHintConfigs({
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

export const useTypeHintConfigList = () => {
  const { accessToken, locale } = useAuthContext();

  return useQuery<string[]>({
    queryKey: ["typeHintConfigsList"],
    queryFn: () => {
      if (!accessToken) throw new Error("No access token found");

      return fetchTypeHintConfigsList(accessToken, locale);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
    /* (enabled) is a React Query option that tells React Query whether the query should automatically run. =>  !!accessToken is a JavaScript trick to convert a value to a boolean: If accessToken is a string (truthy) → !!accessToken === true. If accessToken is null or undefined → !!accessToken === false. => So in plain words: 👉 The query will only run if you have an access token. If no token is available yet (for example, session hasn’t loaded), React Query will skip the query until accessToken exists. */
  });
};

export const useActiveTypeHintConfigsQuery = () => {
  const { accessToken, locale } = useAuthContext();

  return useQuery<DataListResponse<TypeHintConfig>>({
    queryKey: ["activeTypeHintConfigs"],
    queryFn: () => {
      if (!accessToken) throw new Error("No access token found");

      return fetchActiveTypeHintConfigs(accessToken, locale);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
