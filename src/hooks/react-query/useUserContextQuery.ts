import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { UserContext } from "@/types/userContext.type";
import { authFetcher } from "@/utils/authFetcher";
import { useLocale } from "next-intl";
import { fetcher } from "@/utils/fetcher";

export const fetchUserContext = async ({
  lang = "en",
  token,
}: {
  lang?: Locale | string;
  token?: string;
}): Promise<DataResponse<UserContext>> => {
  const url = new URL(API_ENDPOINTS.USER.CONTEXT);
  if (lang) url.searchParams.append("lang", lang);

  if (token) {
    return fetcher<DataResponse<UserContext>>(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  }

  return authFetcher<DataResponse<UserContext>>(url.toString());
};

export const userContextQuery = (locale: Locale | string, token?: string) => ({
  queryKey: ["userContext", locale] as const,
  queryFn: () => fetchUserContext({ lang: locale, token }),
});

export const useUserContextQuery = () => {
  const locale = useLocale();
  const { isAuthenticated } = useAuthContext();

  return useQuery({
    ...userContextQuery(locale),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: isAuthenticated,
  });
};
