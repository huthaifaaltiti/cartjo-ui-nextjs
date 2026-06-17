import { Locale } from "@/types/locale";
import { fetchStaticNationalist } from "../useNationalityQuery";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";

export const STATIC_NATIONALITY_LIST_QUERY_KEY =
  "staticNationalityList" as const;

export const getStaticNationalityListQueryOptions = (
  locale: Locale | string,
) => ({
  queryKey: [STATIC_NATIONALITY_LIST_QUERY_KEY, locale],
  queryFn: () =>
    fetchStaticNationalist({
      lang: locale,
    }),
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
  enabled: true,
});
