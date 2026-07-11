import { GC_TIME, STALE_TIME } from "@/config/reactQueryOptions";
import { Locale } from "@/types/locale";
import { QueryFunctionContext } from "@tanstack/react-query";
import { UserContext } from "@/types/userContext.type";
import { DataResponse } from "@/types/service-response.type";

export const USER_CONTEXT_KEY = "userContext" as const;

export const getUserContextQueryOptions = ({
  locale,
  userId,
  queryFn,
}: {
  locale: Locale | string;
  userId: string | null | undefined;
  queryFn: (
    context: QueryFunctionContext,
  ) => Promise<DataResponse<UserContext>>;
}) => ({
  queryKey: [USER_CONTEXT_KEY, locale, userId],
  queryFn,
  staleTime: STALE_TIME,
  gcTime: GC_TIME,
});
