import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { Showcase } from "@/types/showcase.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

interface FetchActiveShowcasesParams {
  lang?: Locale | string;
  limit?: number;
  fetcher: (url: string) => Promise<DataListResponse<Showcase>>;
}

export const fetchActiveShowcases = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.PUBLIC_VIEW.ACTIVE_SHOWCASE ?? 5,
  fetcher,
}: FetchActiveShowcasesParams): Promise<DataListResponse<Showcase>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.SHOWCASES.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);
  if (limit) url.searchParams.append("limit", String(limit));

  return fetcher(url.toString());
};

interface FetchShowcasesParams {
  lang?: Locale | string;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<Showcase>>;
}

export const fetchShowcases = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.SHOWCASES,
  lastId,
  search,
  fetcher,
}: FetchShowcasesParams): Promise<DataListResponse<Showcase>> => {
  console.log("fetchShowcases");
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.SHOWCASES.ALL}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
