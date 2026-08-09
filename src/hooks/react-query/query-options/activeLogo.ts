import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Logo } from "@/types/logo";
import { LogoType } from "@/enums/logoType.enum";

export const ACTIVE_LOGO_QUERY_KEY = "activeLogo" as const;

export const getActiveLogoQueryOptions = ({
  locale,
  type,
  queryFn,
}: {
  locale: string | Locale;
  type: LogoType;
  queryFn: (context: QueryFunctionContext) => Promise<DataResponse<Logo>>;
}) => ({
  queryKey: [ACTIVE_LOGO_QUERY_KEY, locale, type],
  queryFn,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
