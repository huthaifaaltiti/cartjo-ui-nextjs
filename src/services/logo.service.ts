import { API_ENDPOINTS } from "@/lib/apiEndpoints";
import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { Logo } from "@/types/logo";
import { Locale as LocaleEnum } from "@/enums/locale.enum";

interface FetchActiveLogoParams {
  lang?: Locale | string;
  fetcher: (url: string) => Promise<DataResponse<Logo>>;
}

export const fetchActiveLogo = async ({
  lang = LocaleEnum.EN,
  fetcher,
}: FetchActiveLogoParams): Promise<DataResponse<Logo>> => {
  const url = new URL(`${API_ENDPOINTS.DASHBOARD.LOGOS.ACTIVE}`);

  if (lang) url.searchParams.append("lang", lang);

  return fetcher(url.toString());
};
