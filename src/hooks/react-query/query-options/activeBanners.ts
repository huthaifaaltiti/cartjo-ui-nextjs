import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Banner } from "@/types/banner.type";

export const ACTIVE_BANNERS_QUERY_KEY = "activeBanners" as const;

export const getActiveBannersQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Banner>>;
}) => ({
  queryKey: [ACTIVE_BANNERS_QUERY_KEY, locale],
  queryFn,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
