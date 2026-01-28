import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { User } from "@/types/user";
import { fetcher } from "@/utils/fetcher";

interface FetchMyProfileArgs {
  token: string;
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

  const response = await fetcher<DataResponse<User>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  return response;
};

export const useUserProfileQuery = (userId: string | null | undefined) => {
  const { accessToken, locale } = useAuthContext();

  return useQuery({
    queryKey: ["userProfileData", locale, userId],
    queryFn: () =>
      fetchMyProfile({
        token: accessToken,
        lang: locale,
        userId,
      }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!userId,
  });
};
