import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { User } from "@/types/user";
import { UsersStats } from "@/types/UsersStats";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

export interface UsersStatsResp {
  isSuccess: boolean;
  message: string;
  stats: UsersStats;
}

interface FetchUsersParams {
  lang: Locale | string;
  fetcher: (url: string) => Promise<UsersStatsResp>;
}

export const fetchUsersStats = async ({
  lang,
  fetcher,
}: FetchUsersParams): Promise<UsersStatsResp> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.USERS.GET_USERS_STATS);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};

interface FetchActiveUsersParams {
  lang?: string | Locale;
  limit?: number;
  lastId?: string;
  search?: string;
  isActive?: boolean;
  fetcher: (url: string) => Promise<ActiveUsersResp>;
}

export interface ActiveUsersResp {
  isSuccess: boolean;
  message: string;
  usersNum: number;
  users: User[];
}

export const fetchActiveUsers = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.ACTIVE_USERS,
  lastId,
  search,
  isActive,
  fetcher,
}: FetchActiveUsersParams): Promise<ActiveUsersResp> => {
  const url = new URL(
    `${API_ENDPOINTS.DASHBOARD.USERS.GET_ACTIVE_USERS}?isActive=true`,
  );

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);
  if (typeof isActive === "boolean")
    url.searchParams.append("isActive", isActive.toString());

  return fetcher(url.toString());
};

export interface TotalUsersResp {
  isSuccess: boolean;
  message: string;
  usersNum: number;
  users: User[];
}

interface FetchTotalUsersParams {
  lang?: string;
  limit?: number;
  lastId?: string;
  search?: string;
  fetcher: (url: string) => Promise<TotalUsersResp>;
}

export const fetchTotalUsers = async ({
  lang = LocaleEnum.EN,
  limit = PAGINATION_LIMITS.DASHBOARD_VIEW.TOTAL_USERS ?? 20,
  lastId,
  search,
  fetcher,
}: FetchTotalUsersParams): Promise<TotalUsersResp> => {
  const url = new URL(API_ENDPOINTS.DASHBOARD.USERS.GET_TOTAL_USERS);

  url.searchParams.append("limit", limit.toString());
  if (lang) url.searchParams.append("lang", lang);
  if (lastId) url.searchParams.append("lastId", lastId);
  if (search) url.searchParams.append("search", search);

  return fetcher(url.toString());
};
