import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Logo } from "@/types/logo";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { LogoType } from "@/enums/logoType.enum";

interface FetchActiveLogoParams {
  lang?: Locale | string;
  type?: LogoType;
  fetcher: (url: string) => Promise<DataResponse<Logo>>;
}

export const fetchActiveLogo = async ({
  lang = LocaleEnum.EN,
  type = LogoType.MAIN,
  fetcher,
}: FetchActiveLogoParams): Promise<DataResponse<Logo>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.LOGOS.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);
  if (type) url.searchParams.append("type", type);

  return fetcher(url.toString());
};

interface FetchLogosParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<Logo>>;
}

export const fetchLogos = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.DASHBOARD_VIEW.LOGOS ?? 10,
  lastId,
  search,
  fetcher,
}: FetchLogosParams): Promise<DataListResponse<Logo>> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.LOGOS.ALL);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
