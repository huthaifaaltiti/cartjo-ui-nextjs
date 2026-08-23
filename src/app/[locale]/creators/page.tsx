import CreatorsPageContainer from "@/components/creators/CreatorsContainer";
import { isArabicLocale } from "@/config/locales.config";
import { LogoType } from "@/enums/logoType.enum";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { prefetchActiveCreatorsVideos } from "@/services/prefetch/activeCreatorsVideos";
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

  await Promise.all([
    prefetchActiveLogo({ queryClient, locale, type: LogoType.CREATORS }),
    prefetchActiveCreatorsVideos({ queryClient, locale, type: "hero" }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorsPageContainer isArabic={isArabicLocale(locale)} />
    </HydrationBoundary>
  );
}
