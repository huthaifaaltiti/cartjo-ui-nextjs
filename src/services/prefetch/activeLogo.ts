import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { fetchActiveLogo } from "@/services/logo.service";
import { Logo } from "@/types/logo";
import { getActiveLogoQueryOptions } from "@/hooks/react-query/query-options/activeLogo";
import { LogoType } from "@/enums/logoType.enum";

export async function prefetchActiveLogo({
  queryClient,
  locale,
  type,
}: {
  locale: Locale | string;
  type?: LogoType;
  queryClient: QueryClient;
}): Promise<void> {
  const fallbackLocale = locale ?? Locale.EN;
  const fallbackType = type ?? LogoType.MAIN;

  await queryClient.prefetchQuery<DataResponse<Logo>>(
    getActiveLogoQueryOptions({
      locale: fallbackLocale,
      type: fallbackType,
      queryFn: async () => {
        return fetchActiveLogo({
          lang: fallbackLocale,
          type: fallbackType,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataResponse<Logo>>(path);


            if (!ok || !data || status === 404) {
              throw new Error(
                `[HomePage or CreatorsPage] Failed to fetch active logo: ${status}`,
              );
            }
            return data;
          },
        });
      },
    }),
  );
}
