import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { CreatorStore } from "@/types/creators/creatorStore";

export const CREATOR_STORE_KEY = "creatorStore" as const;

interface CreatorStoreQueryOptionsParams {
  locale: string | Locale;
  type?: string;
  queryFn: () => Promise<DataResponse<CreatorStore>>;
}

export const getCreatorStoreQueryOptions = ({
  locale,
  queryFn,
}: CreatorStoreQueryOptionsParams) => ({
  queryKey: [CREATOR_STORE_KEY, locale],
  queryFn,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
