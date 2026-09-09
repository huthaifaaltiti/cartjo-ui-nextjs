import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Locale as LocaleEnum } from "@/enums/locale.enum";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";
import { authFetcher } from "@/utils/authFetcher";

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

export interface CreateCreatorsVideoPayload {
  title_ar: string;
  title_en: string;
  type: string;
  video: File;
  lang?: string;
}

export const createCreatorsVideo = async (
  payload: CreateCreatorsVideoPayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorsVideo>> = authFetcher,
): Promise<DataResponse<CreatorsVideo>> => {
  const formData = new FormData();
  formData.append("title_ar", payload.title_ar);
  formData.append("title_en", payload.title_en);
  formData.append("type", payload.type?.toLowerCase());
  formData.append("video", payload.video);

  const lang = payload.lang ? `?lang=${payload.lang}` : "";

  return fetcher(`${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.CREATE}${lang}`, {
    method: "POST",
    body: formData,
  });
};

export interface UpdateCreatorsVideoPayload {
  id: string;
  title_ar?: string;
  title_en?: string;
  type?: string;
  video?: File | null;
  lang?: string;
}

export const updateCreatorsVideo = async (
  payload: UpdateCreatorsVideoPayload,
  fetcher: (
    path: string,
    options?: RequestInit,
  ) => Promise<DataResponse<CreatorsVideo>> = authFetcher,
): Promise<DataResponse<CreatorsVideo>> => {
  const formData = new FormData();
  formData.append("id", payload.id);
  if (payload.title_ar) formData.append("title_ar", payload.title_ar);
  if (payload.title_en) formData.append("title_en", payload.title_en);
  if (payload.type) formData.append("type", payload.type?.toLowerCase());
  if (payload.video) formData.append("video", payload.video);

  const lang = payload.lang ? `?lang=${payload.lang}` : "";

  return fetcher(
    `${API_ENDPOINTS.DASHBOARD.CREATORS_VIDEOS.EDIT}/${payload.id}${lang}`,
    {
      method: "PUT",
      body: formData,
    },
  );
};
