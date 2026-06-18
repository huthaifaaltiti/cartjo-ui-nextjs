import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Showcase } from "@/types/showcase.type";

export const SHOWCASES_QUERY_KEY = "showcases" as const;

export const getShowcasesQueryOptions = ({
  locale,
  search,
  queryFn,
}: {
  locale: string | Locale;
  search: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<Showcase>>;
}) => {
  return {
    queryKey: [SHOWCASES_QUERY_KEY, search, locale],
    queryFn,
    getNextPageParam: (lastPage: DataListResponse<Showcase>) => {
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
