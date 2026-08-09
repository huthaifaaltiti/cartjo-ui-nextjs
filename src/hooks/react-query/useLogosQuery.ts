import {
  QueryFunctionContext,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import { Logo } from "@/types/logo";
import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { PAGINATION_LIMITS } from "@/config/paginationConfig";
import { useAuthContext } from "../useAuthContext";
import { getActiveLogoQueryOptions } from "./query-options/activeLogo";
import { fetchActiveLogo, fetchLogos } from "@/services/logo.service";
import { Locale } from "@/types/locale";
import { authFetcher } from "@/utils/authFetcher";
import { getLogosQueryOptions } from "./query-options/logos";
import { LogoType } from "@/enums/logoType.enum";

export const useActiveLogoQuery = (type: LogoType = LogoType.MAIN) => {
  const { locale } = useAuthContext();

  return useQuery<DataResponse<Logo>>({
    ...getActiveLogoQueryOptions({
      locale,
      type,
      queryFn: () =>
        fetchActiveLogo({
          lang: locale as Locale,
          type,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};

export const useLogosQuery = (search?: string) => {
  const { locale, isAuthenticated, isSessionLoading, userId } =
    useAuthContext();

  return useInfiniteQuery<DataListResponse<Logo>>({
    ...getLogosQueryOptions({
      search,
      locale,
      queryFn: (context: QueryFunctionContext) =>
        fetchLogos({
          lang: locale,
          limit: PAGINATION_LIMITS.DASHBOARD_VIEW.LOGOS,
          lastId: context?.pageParam as string,
          search,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};
