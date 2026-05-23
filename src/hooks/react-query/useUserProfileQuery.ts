import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";
import { getUserProfileQueryOptions } from "./query-options/userProfile";
import { authFetcher } from "@/utils/authFetcher";

interface FetchMyProfileArgs {
  token?: string;
  lang?: string;
  userId: string | null | undefined;
}

export const fetchMyProfile = async ({
  token,
  lang = "en",
  userId,
}: FetchMyProfileArgs): Promise<DataResponse<User>> => {
  const url = new URL(`${API_ENDPOINTS.USER.PROFILE}/${userId}`);

  if (lang) url.searchParams.append("lang", lang.toString());

  if (token) {
    return fetcher<DataResponse<User>>(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }

  return authFetcher<DataResponse<User>>(url.toString());
};

export const useUserProfileQuery = (
  userId: string | null | undefined,
  token?: string,
) => {
  const { locale } = useAuthContext();

  return useQuery({
    ...getUserProfileQueryOptions(locale, userId, token),
  });
};
