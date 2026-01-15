import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { userContextQuery } from "@/hooks/react-query/useUserContextQuery";
import { getAccessTokenFromServerSession } from "@/lib/serverSession";
import { Locale } from "@/types/locale";
import { DataResponse } from "@/types/service-response.type";
import { UserContext } from "@/types/userContext.type";

export default async function UserContextHydrator({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const token = await getAccessTokenFromServerSession();
  if (!token) return children;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery<DataResponse<UserContext>>(
    userContextQuery(locale, token)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
