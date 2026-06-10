import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { fetchActiveLogo } from "@/services/logo.service";
import { Logo } from "@/types/logo";
import { getActiveLogoQueryOptions } from "@/hooks/react-query/query-options/activeLogo";

export async function prefetchActiveLogo({
  queryClient,
  locale,
}: {
  locale: Locale | string;
  queryClient: QueryClient;
}): Promise<void> {
  const fallbackLocale = locale ?? Locale.EN;

  await queryClient.prefetchQuery<DataResponse<Logo>>(
    getActiveLogoQueryOptions({
      locale: fallbackLocale,
      queryFn: async () => {
        return fetchActiveLogo({
          lang: fallbackLocale,
          fetcher: async (path) => {
            const { data, ok, status } =
              await apiFetch<DataResponse<Logo>>(path);

            if (!ok || !data) {
              throw new Error(
                `[HomePage] Failed to fetch active logo: ${status}`,
              );
            }
            return data;
          },
        });
      },
    }),
  );
}
