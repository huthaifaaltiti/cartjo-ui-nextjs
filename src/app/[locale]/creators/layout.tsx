import { getQueryClient } from "@/utils/queryUtils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { LogoType } from "@/enums/logoType.enum";

interface NextLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function CreatorsDashboardLayout({
  children,
  params,
}: NextLayoutProps) {
  const { locale } = await params;

  const queryClient: QueryClient = getQueryClient();

  await prefetchActiveLogo({ queryClient, locale, type: LogoType.CREATORS });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full min-h-screen bg-[#f5f4fe]">{children}</div>
    </HydrationBoundary>
  );
}
