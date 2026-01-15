import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { useAuthContext } from "../useAuthContext";
import { UserContext } from "@/types/userContext.type";
import { fetcher } from "@/utils/fetcher";

// Fetcher
export const fetchUserContext = async ({
  lang = "en",
  accessToken,
}: {
  lang?: Locale | string;
  accessToken: string;
}): Promise<DataResponse<UserContext>> => {
  const url = new URL(API_ENDPOINTS.USER.CONTEXT);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher<DataResponse<UserContext>>(
    url,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );
};

// QUERY OPTIONS FACTORY
export const userContextQuery = (
  locale: Locale | string,
  accessToken: string
) => ({
  queryKey: ["userContext", locale, accessToken] as const,
  queryFn: () =>
    fetchUserContext({
      lang: locale,
      accessToken,
    }),
});

// CLIENT HOOK
export const useUserContextQuery = () => {
  const { locale, accessToken } = useAuthContext();

  return useQuery({
    ...userContextQuery(locale, accessToken!),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !!accessToken,
  });
};
