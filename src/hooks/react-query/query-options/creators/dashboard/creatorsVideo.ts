import { DataListResponse, DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { CreatorsVideo } from "@/types/creators/creatorsVideo";

export const CREATORS_VIDEOS_KEY = "creatorsVideos" as const;
export const ACTIVE_CREATORS_VIDEOS_KEY = "activeCreatorsVideos" as const;

interface CreatorsVideosQueryOptionsParams {
  locale: string | Locale;
  search?: string;
  type?: string;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataListResponse<CreatorsVideo>>;
}

export const getCreatorsVideosQueryOptions = ({
  locale,
  search,
  type,
  queryFn,
}: CreatorsVideosQueryOptionsParams) => {
  const getNextPageParam = (lastPage: DataListResponse<CreatorsVideo>) => {
    const lastItem = lastPage.data[lastPage.data.length - 1];
    return lastItem ? lastItem._id : undefined;
  };

  return {
    queryKey: [CREATORS_VIDEOS_KEY, search, type, locale],
    queryFn,
    getNextPageParam,
    initialPageParam: undefined,
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
  };
};

interface ActiveCreatorsVideosQueryOptionsParams {
  locale: string | Locale;
  type?: string;
  queryFn: () => Promise<DataResponse<CreatorsVideo[]>>;
}

export const getActiveCreatorsVideosQueryOptions = ({
  locale,
  type,
  queryFn,
}: ActiveCreatorsVideosQueryOptionsParams) => ({
  queryKey: [ACTIVE_CREATORS_VIDEOS_KEY, type, locale],
  queryFn,
  initialPageParam: undefined,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
