import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { Locale } from "@/types/locale";
import { DataResponse } from "@/types/service-response.type";
import { UserContext } from "@/types/userContext.type";

export const fetchUserContext = async ({
  lang = "en",
  fetcher
}: {
  lang?: Locale | string;
   fetcher: (url: string) => Promise<DataResponse<UserContext>>;
}): Promise<DataResponse<UserContext>> => {
  const url = new URL(API_ENDPOINTS.USER.CONTEXT);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString())
};
