import CreatorsPageContainer from "@/components/creators/CreatorsContainer";
import { isArabicLocale } from "@/config/locales.config";
import { CreatorsVideoType } from "@/enums/creatorsVideoType.enum";
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

  await prefetchActiveCreatorsVideos({
    queryClient,
    locale,
    type: CreatorsVideoType.HERO,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorsPageContainer isArabic={isArabicLocale(locale)} />
    </HydrationBoundary>
  );
}
