"use client";

import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/types/service-response.type";
import { Locale } from "@/types/locale";
import { authFetcher } from "@/utils/authFetcher";
import { getCreatorStoreQueryOptions } from "../query-options/creators/creatorStore";
import { useAuthContext } from "@/hooks/useAuthContext";
import { CreatorStore } from "@/types/creators/creatorStore";
import { fetchCreatorStore } from "@/services/creators/creatorStore.service";

export const useCreatorStoreQuery = () => {
  const { locale } = useAuthContext();

  return useQuery<DataResponse<CreatorStore>>({
    ...getCreatorStoreQueryOptions({
      locale,
      queryFn: () =>
        fetchCreatorStore({
          lang: locale as Locale,
          fetcher: (path) => authFetcher(path),
        }),
    }),
  });
};
