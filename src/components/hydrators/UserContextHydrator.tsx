import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { userContextQuery } from "@/hooks/react-query/useUserContextQuery";
import { Locale } from "@/types/locale";
import { DataResponse } from "@/types/service-response.type";
import { UserContext } from "@/types/userContext.type";
import { getAccessToken } from "@/lib/tokens.server";

export default async function UserContextHydrator({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const token = await getAccessToken();
  const queryClient = getQueryClient();

  if (token) {
    await queryClient.prefetchQuery<DataResponse<UserContext>>(
      userContextQuery(locale, token),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
