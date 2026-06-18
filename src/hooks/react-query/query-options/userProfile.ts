import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { fetchMyProfile } from "../useUserProfileQuery";

export const USER_PROFILE_DATA_KEY = "userProfileData" as const;

export const getUserProfileQueryOptions = (
  locale: Locale | string,
  userId: string | null | undefined,
  token?: string,
) => ({
  queryKey: [USER_PROFILE_DATA_KEY, locale, userId],
  queryFn: () =>
    fetchMyProfile({
      token,
      lang: locale,
      userId,
    }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: !!userId,
});
