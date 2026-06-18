import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { TypeHintConfig } from "@/types/typeHintConfig.type";

export const TYPE_HINT_CONFIGS_QUERY_KEY = "typeHintConfigs" as const;

export const getTypeHintConfigsQueryOptions = ({
  locale,
  search,
  queryFn,
}: {
  locale: string | Locale;
  search: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<TypeHintConfig>>;
}) => {
  return {
    queryKey: [TYPE_HINT_CONFIGS_QUERY_KEY, search, locale],
    queryFn,
    getNextPageParam: (lastPage: DataListResponse<TypeHintConfig>) => {
      if (lastPage.data && lastPage.data.length > 0) {
        const lastItem = lastPage.data[lastPage.data.length - 1];
        return lastItem._id;
      }
      return undefined;
    },
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
