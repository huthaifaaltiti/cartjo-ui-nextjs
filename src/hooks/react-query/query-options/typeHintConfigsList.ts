import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";

export const TYPE_HINT_CONFIGS_LIST_QUERY_KEY = "typeHintConfigsList" as const;

export const getTypeHintConfigsListQueryOptions = ({
  locale,
  queryFn,
}: {
  locale: string | Locale;
  queryFn: (context: QueryFunctionContext) => Promise<string[]>;
}) => {
  return {
    queryKey: [TYPE_HINT_CONFIGS_LIST_QUERY_KEY, locale],
    queryFn,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
