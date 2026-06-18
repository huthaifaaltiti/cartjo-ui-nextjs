import { DataListResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { Banner } from "@/types/banner.type";

export const BANNERS_QUERY_KEY = "banners" as const;

export const getBannersQueryOptions = ({
  locale,
  search,
  queryFn,
}: {
  locale: string | Locale;
  search?: string;
  queryFn: (context: QueryFunctionContext) => Promise<DataListResponse<Banner>>;
}) => ({
  queryKey: [BANNERS_QUERY_KEY, locale, search],
  queryFn,
  initialPageParam: undefined as string | undefined,
  getNextPageParam: (lastPage: DataListResponse<Banner>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  },
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
