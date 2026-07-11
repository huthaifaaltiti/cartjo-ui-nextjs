import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/utils/queryUtils";
import { Locale } from "@/types/locale";
import { prefetchUserContext } from "@/services/prefetch/userContext";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

export default async function UserContextHydrator({
  locale,
  session,
  children,
}: {
  locale: Locale;
  session: CartJOSession | TokenSession | null;
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  await prefetchUserContext({ queryClient, locale, session });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}
