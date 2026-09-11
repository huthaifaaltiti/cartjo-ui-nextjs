import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { getQueryClient } from "@/utils/queryUtils";
import { Locale } from "@/types/locale";
import { prefetchPublicCreatorStoreData } from "@/services/prefetch/publicCreatorStore";
import CreatorStorefrontContainer from "@/components/creators/storefront/CreatorStorefrontContainer";

interface CreatorPageProps {
  params: Promise<{ locale: Locale | string; handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: CreatorPageProps): Promise<Metadata> {
  const { locale, handle } = await params;
  const cleanHandle = decodeURIComponent(handle).replace(/^@/, "").trim();
  const isAr = locale === "ar";

  return {
    title: isAr
      ? `متجر @${cleanHandle} | كارت جو`
      : `@${cleanHandle}'s Store | CartJO`,
    description: isAr
      ? `تسوق أحدث المنتجات من متجر @${cleanHandle} على منصة كارت جو.`
      : `Shop the latest curated products from @${cleanHandle} on CartJO.`,
  };
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { locale, handle } = await params;
  const cleanHandle = decodeURIComponent(handle)
    .replace(/^@/, "")
    .toLowerCase()
    .trim();

  const queryClient = getQueryClient();

  await prefetchPublicCreatorStoreData({
    locale,
    queryClient,
    handle: cleanHandle,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorStorefrontContainer handle={cleanHandle} />
    </HydrationBoundary>
  );
}
