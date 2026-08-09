import CreatorsPageContainer from "@/components/creators/CreatorsContainer";
import { LogoType } from "@/enums/logoType.enum";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { Locale } from "@/types/locale";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function CreatorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  const queryClient = getQueryClient();

  await prefetchActiveLogo({ queryClient, locale, type: LogoType.CREATORS });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorsPageContainer />
    </HydrationBoundary>
  );
}
