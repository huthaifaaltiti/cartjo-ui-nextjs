import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { TypeHintConfig } from "@/types/typeHintConfig.type";
import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { useAuthContext } from "../useAuthContext";
import { getTypeHintConfigsQueryOptions } from "./query-options/typeHintConfigs";
import { authFetcher } from "@/utils/authFetcher";
import {
  fetchTypeHintActiveListConfigs,
  fetchTypeHintConfigs,
  fetchTypeHintConfigsList,
} from "@/services/typeHintConfig.service";
import { getTypeHintConfigsListQueryOptions } from "./query-options/typeHintConfigsList";
import { getTypeHintConfigsActiveListQueryOptions } from "./query-options/typeHintConfigsActiveList";

export const useTypeHintConfigsQuery = ({ search }: { search: string }) => {
  const { isAuthenticated, locale, userId, isSessionLoading } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<TypeHintConfig>>({
    ...getTypeHintConfigsQueryOptions({
      locale,
      search,
      queryFn: (context: QueryFunctionContext) =>
        fetchTypeHintConfigs({
          lang: (context.queryKey[2] as string) || locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.TYPE_HINT_CONFIGS ?? 20,
          lastId: context?.pageParam as string,
          search: (context.queryKey[1] as string) || search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};

export const useTypeHintConfigListQuery = () => {
  const { isAuthenticated, locale, userId, isSessionLoading } =
    useAuthContext();

  return useQuery<string[]>({
    ...getTypeHintConfigsListQueryOptions({
      locale,
      queryFn: (context) =>
        fetchTypeHintConfigsList({
          lang: (context.queryKey[1] as string) || locale,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};

export const useActiveTypeHintConfigsQuery = () => {
  const { isAuthenticated, locale, userId, isSessionLoading } =
    useAuthContext();

  return useQuery<DataResponse<string[]>>({
    ...getTypeHintConfigsActiveListQueryOptions({
      locale,
      queryFn: (context) =>
        fetchTypeHintActiveListConfigs({
          lang: (context.queryKey[1] as string) || locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.TYPE_HINT_CONFIGS,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: isAuthenticated && !!userId && !isSessionLoading,
  });
};
