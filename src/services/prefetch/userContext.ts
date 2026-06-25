import { QueryClient } from "@tanstack/react-query";
import { Locale } from "@/enums/locale.enum";
import { DataResponse } from "@/types/service-response.type";
import { apiFetch } from "@/lib/api.server";
import { getUserContextQueryOptions } from "@/hooks/react-query/query-options/userContext";
import { fetchUserContext } from "../userContext.service";
import { UserContext } from "@/types/userContext.type";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

export async function prefetchUserContext({
  queryClient,
  locale,
  session,
}: {
  queryClient: QueryClient;
  locale: string;
  session: CartJOSession | TokenSession | null;
}) {
  const fallbackLocale = locale ?? Locale.EN;

  if (session) {
    await queryClient.prefetchQuery(
      getUserContextQueryOptions({
        locale: fallbackLocale,
        userId: session?._id,
        queryFn: () =>
          fetchUserContext({
            lang: fallbackLocale,
            fetcher: async (path) => {
              const { data, ok, status } =
                await apiFetch<DataResponse<UserContext>>(path);

              if (!ok || !data) {
                throw new Error(
                  `[PrefetchedUserContext] Failed to fetch user context: ${status}`,
                );
              }
              return data;
            },
          }),
      }),
    );
  }
}
