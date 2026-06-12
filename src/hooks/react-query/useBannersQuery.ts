import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { Banner } from "@/types/banner.type";
import { DataListResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { getActiveBannersQueryOptions } from "./query-options/activeBanners";
import { fetchActiveBanners, fetchBanners } from "@/services/banner.service";
import { authFetcher } from "@/utils/authFetcher";
import { useAuthContext } from "../useAuthContext";
import { getBannersQueryOptions } from "./query-options/banners";

export const useActiveBannersQuery = () => {
  const { locale } = useAuthContext();

  return useQuery<DataListResponse<Banner>>({
    ...getActiveBannersQueryOptions({
      locale,
      queryFn: () =>
        fetchActiveBanners({
          lang: locale as Locale,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: true,
  });
};

export const useBannersQuery = ({ search }: { search: string }) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Banner>>({
    ...getBannersQueryOptions({
      locale,
      search,
      queryFn: (context: QueryFunctionContext) =>
        fetchBanners({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.BANNERS,
          lastId: context?.pageParam as string,
          search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};
