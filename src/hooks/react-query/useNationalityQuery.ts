import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { fetcher } from "@/utils/fetcher";
import { StaticNationality } from "@/types/nationality.type";

interface FetchNationalityListArgs {
  token: string;
  lang?: string;
}

export const fetchStaticNationalist = async ({
  token,
  lang = "en",
}: FetchNationalityListArgs): Promise<DataResponse<StaticNationality[]>> => {
  const url = new URL(API_ENDPOINTS.USER.NATIONALITY_STATIC_LIST);

  if (lang) url.searchParams.append("lang", lang.toString());

  return fetcher<DataResponse<StaticNationality[]>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useStaticNationalityListQuery = () => {
  const { accessToken, locale } = useAuthContext();

  return useQuery({
    queryKey: ["staticNationalityList", locale],
    queryFn: () =>
      fetchStaticNationalist({
        token: accessToken,
        lang: locale,
      }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: true,
  });
};
