import { DataResponse } from "@/types/service-response.type";
import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { CreatorStore } from "@/types/creators/creatorStore";

export const PUBLIC_CREATOR_STORE_KEY = "publicCreatorStore" as const;

interface PublicCreatorStoreQueryOptionsParams {
  locale: string | Locale;
  handle: string;
  queryFn: () => Promise<DataResponse<CreatorStore>>;
}

export const getPublicCreatorStoreQueryOptions = ({
  locale,
  handle,
  queryFn,
}: PublicCreatorStoreQueryOptionsParams) => ({
  queryKey: [
    PUBLIC_CREATOR_STORE_KEY,
    locale,
    handle.replace(/^@/, "").toLowerCase().trim(),
  ],
  queryFn,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
