"use client";

import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { fetcher } from "@/utils/fetcher";
import { getPublicCreatorStoreQueryOptions } from "../query-options/creators/publicCreatorStore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { CreatorStore } from "@/types/creators/creatorStore";
import { fetchPublicCreatorStore } from "@/services/creators/creatorStore.service";

interface UsePublicCreatorStoreQueryParams {
  handle: string;
  enabled?: boolean;
}

export const usePublicCreatorStoreQuery = ({
  handle,
  enabled = true,
}: UsePublicCreatorStoreQueryParams) => {
  const { locale } = useAuthContext();
  const cleanHandle = handle
    ? handle.replace(/^@/, "").toLowerCase().trim()
    : "";

  return useQuery<DataResponse<CreatorStore>>({
    ...getPublicCreatorStoreQueryOptions({
      locale,
      handle: cleanHandle,
      queryFn: () =>
        fetchPublicCreatorStore({
          handle: cleanHandle,
          lang: locale as Locale,
          fetcher: (path) => fetcher(path),
        }),
    }),
    enabled: Boolean(cleanHandle) && enabled,
  });
};
