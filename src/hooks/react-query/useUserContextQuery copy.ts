import { useQuery } from "@tanstack/react-query";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { useAuthContext } from "../useAuthContext";
import { authFetcher } from "@/utils/authFetcher";
import { fetchUserContext } from "@/services/userContext.service";
import { getUserContextQueryOptions } from "./query-options/userContext";

export const useUserContextQuery = () => {
  const { isAuthenticated, isSessionLoading, userId, locale } =
    useAuthContext();

  return useQuery({
    ...getUserContextQueryOptions({
      locale,
      userId,
      queryFn: () =>
        fetchUserContext({
          lang: locale,
          fetcher: (path) => authFetcher(path),
        }),
    }),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: !isSessionLoading && isAuthenticated && !!userId,
  });
};
