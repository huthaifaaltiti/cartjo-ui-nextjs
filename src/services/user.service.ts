import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { User } from "@/types/user";
import { UsersStats } from "@/types/UsersStats";

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
  lang = "en",
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
