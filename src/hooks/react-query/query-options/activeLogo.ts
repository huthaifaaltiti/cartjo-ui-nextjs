import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Logo } from "@/types/logo";

export const ACTIVE_LOGO_QUERY_KEY = "activeLogo" as const;

export const getActiveLogoQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataResponse<Logo>>;
}) => ({
  queryKey: [ACTIVE_LOGO_QUERY_KEY, locale],
  queryFn,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});