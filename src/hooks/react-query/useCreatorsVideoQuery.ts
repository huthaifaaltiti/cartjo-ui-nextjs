import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { CreatorsVideo } from "@/types/creatorsVideo";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { useAuthContext } from "../useAuthContext";
import {
  getActiveCreatorsVideosQueryOptions,
  getCreatorsVideosQueryOptions,
} from "./query-options/creatorsVideo";
import {
  fetchActiveCreatorsVideos,
  fetchCreatorsVideos,
} from "@/services/creatorsVideo.service";
import { Locale } from "@/types/locale";
import { authFetcher } from "@/utils/authFetcher";

export const useActiveCreatorsVideosQuery = (type = "HERO") => {
  const { locale } = useAuthContext();

  return useQuery<DataResponse<CreatorsVideo[]>>({
    ...getActiveCreatorsVideosQueryOptions({
      locale,
      type,
      queryFn: () =>
        fetchActiveCreatorsVideos({
          lang: locale as Locale,
          type,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};

export const useCreatorsVideosQuery = (search?: string, type?: string) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<CreatorsVideo>>({
    ...getCreatorsVideosQueryOptions({
      search,
      type,
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchCreatorsVideos({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.BANNERS ?? 10,
          lastId: context?.pageParam as string,
          search,
          type,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};
