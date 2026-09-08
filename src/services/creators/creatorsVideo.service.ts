import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";

interface FetchActiveCreatorsVideosParams {
  lang?: Locale | string;
  type?: string;
  fetcher: (url: string) => Promise<DataResponse<CreatorsVideo[]>>;
}

export const fetchActiveCreatorsVideos = async ({
  lang = LocaleEnum.EN,
  type = CreatorsVideoType.HERO,
  fetcher,
}: FetchActiveCreatorsVideosParams): Promise<DataResponse<CreatorsVideo[]>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);
  if (type) url.searchParams.append("type", type);

  return fetcher(url.toString());
};

interface FetchCreatorsVideosParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  type?: string;
  fetcher: (url: string) => Promise<DataListResponse<CreatorsVideo>>;
}

export const fetchCreatorsVideos = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.DASHBOARD_VIEW.CREATORS_VIDEOS ?? 10,
  lastId,
  search,
  type,
  fetcher,
}: FetchCreatorsVideosParams): Promise<DataListResponse<CreatorsVideo>> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.ALL);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);
  if (type) url.searchParams.append("type", type.toLocaleLowerCase());

  return fetcher(url.toString());
};
