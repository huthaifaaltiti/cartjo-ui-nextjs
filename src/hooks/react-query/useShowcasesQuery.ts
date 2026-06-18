import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse } from "@/types/service-response.type";
import { Showcase } from "@/types/showcase.type";
import { useAuthContext } from "../useAuthContext";
import { Locale } from "@/types/locale";
import {
  fetchActiveShowcases,
  fetchShowcases,
} from "@/services/showcase.service";
import { authFetcher } from "@/utils/authFetcher";
import { getActiveShowcasesQueryOptions } from "./query-options/activeShowcases";
import { getShowcasesQueryOptions } from "./query-options/showcases";

export const useShowcasesQuery = ({ search }: { search: string }) => {
  const { isAuthenticated, isSessionLoading, userId, locale } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Showcase>>({
    ...getShowcasesQueryOptions({
      locale,
      search,
      queryFn: (context) => {
        return fetchShowcases({
          lang: (context.queryKey[2] as string) || locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.SHOWCASES ?? 20,
          lastId: context?.pageParam as string,
          search: (context.queryKey[1] as string) || search,
          fetcher: (path) => authFetcher(path),
        });
      },
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};

export const useActiveShowcasesQuery = ({ limit }: { limit: number }) => {
  const { locale, isSessionLoading } = useAuthContext();

  return useQuery({
    ...getActiveShowcasesQueryOptions({
      locale,
      queryFn: () =>
        fetchActiveShowcases({
          lang: locale as Locale,
          limit,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading,
  });
};
