import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { Banner } from "@/types/banner.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";

interface FetchActiveBannersParams {
  lang?: Locale | string;
  fetcher: (url: string) => Promise<DataListResponse<Banner>>;
}

export const fetchActiveBanners = async ({
  lang = LocaleEnum.EN,
  fetcher,
}: FetchActiveBannersParams): Promise<DataListResponse<Banner>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.BANNERS.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};

interface FetchBannersParams {
  lang?: Locale | string;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<DataListResponse<Banner>>;
}

export const fetchBanners = async ({
  lang = "en",
  limit = PAGINATION_LIMITS.BANNERS,
  lastId,
  search,
  fetcher,
}: FetchBannersParams): Promise<DataListResponse<Banner>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.BANNERS.ALL}`);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
