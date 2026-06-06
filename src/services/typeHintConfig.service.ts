import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { TypeHintConfig } from "@/types/typeHintConfig.type";

interface FetchTypeHintConfigsParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<TypeHintConfig>>;
}

export const fetchTypeHintConfigs = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.TYPE_HINT_CONFIGS,
  lastId,
  search,
  fetcher,
}: FetchTypeHintConfigsParams): Promise<DataListResponse<TypeHintConfig>> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.ALL);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};

interface FetchTypeHintConfigsListParams {
  lang?: string;
  fetcher: (url: string) => Promise<string[]>;
}

export const fetchTypeHintConfigsList = async ({
  lang,
  fetcher,
}: FetchTypeHintConfigsListParams) => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.LIST);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};

interface FetchTypeHintConfigsActiveListParams {
  lang?: string;
  limit?: number;
  fetcher: (url: string) => Promise<string[]>;
}

export const fetchTypeHintActiveListConfigs = async ({
  lang,
  limit,
  fetcher,
}: FetchTypeHintConfigsActiveListParams): Promise<string[]> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.TYPE_HINT_CONFIGS.LIST}`);

  if (lang) url.searchParams.append("lang", lang);
  if (limit) url.searchParams.append("limit", String(limit));

  return fetcher(url.toString());
};
