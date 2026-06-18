import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { DataResponse } from "@/types/service-response.type";
import { QueryFunctionContext } from "@tanstack/react-query";

export const TYPE_HINT_CONFIGS_ACTIVE_LIST_QUERY_KEY =
  "typeHintConfigsActiveList" as const;

export const getTypeHintConfigsActiveListQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (context: QueryFunctionContext) => Promise<DataResponse<string[]>>;
}) => {
  return {
    queryKey: [TYPE_HINT_CONFIGS_ACTIVE_LIST_QUERY_KEY, locale],
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
