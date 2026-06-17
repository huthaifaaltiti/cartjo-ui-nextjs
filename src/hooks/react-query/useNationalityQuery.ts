import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { useAuthContext } from "../useAuthContext";
import { StaticNationality } from "@/types/nationality.type";
import { authFetcher } from "@/utils/authFetcher";

interface FetchNationalityListArgs {
  lang?: string;
}

export const fetchStaticNationalist = async ({
  lang = "en",
}: FetchNationalityListArgs): Promise<DataResponse<StaticNationality[]>> => {
  const url = new URL(API_ENDPOINTS.USER.NATIONALITY_STATIC_LIST);

  if (lang) url.searchParams.append("lang", lang.toString());

  return authFetcher<DataResponse<StaticNationality[]>>(url.toString());
};

export const useStaticNationalityListQuery = () => {
  const { locale } = useAuthContext();

  return useQuery({
    queryKey: ["staticNationalityList", locale],
    queryFn: () =>
      fetchStaticNationalist({
        lang: locale,
      }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: true,
  });
};
