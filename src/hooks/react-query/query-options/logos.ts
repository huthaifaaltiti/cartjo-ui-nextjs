import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Logo } from "@/types/logo";

export const LOGOS_KEY = "logos" as const;

interface LogosQueryOptionsParams {
  locale: string | Locale;
  search?: string;
  queryFn: (context: QueryFunctionContext) => Promise<DataListResponse<Logo>>;
}

export const getLogosQueryOptions = ({
  locale,
  search,
  queryFn,
}: LogosQueryOptionsParams) => {
  const getNextPageParam = (lastPage: DataListResponse<Logo>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  };

  return {
    queryKey: [LOGOS_KEY, search, locale],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};
