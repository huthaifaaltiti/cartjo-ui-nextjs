import { redirect } from "next/navigation";
import { Locale } from "@/types/locale";
import { guardRoute } from "@/lib/route-guard.server";
import { AppRoute } from "@/enums/app-route.enum";
import {
  checkCanAccessCreatorDashboard,
  checkIsCreator,
} from "@/lib/session.server";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { LogoType } from "@/enums/logoType.enum";
import { getQueryClient } from "@/utils/queryUtils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import CreatorsDashboardLayoutContainer from "@/components/creators/CreatorsDashboardLayoutContainer";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}

export default async function CreatorsDashboardLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;

  const { session } = await guardRoute(AppRoute.CREATORS_DASHBOARD);

  const isCreator = checkIsCreator(session);
  const canAccessCreatorDashboard = checkCanAccessCreatorDashboard(session);
  const canManage = isCreator && canAccessCreatorDashboard;

  if (!session || !canManage) {
    redirect(`/${locale}/auth`);
  }

  const queryClient: QueryClient = getQueryClient();

  await prefetchActiveLogo({ queryClient, locale, type: LogoType.CREATORS });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CreatorsDashboardLayoutContainer locale={locale} session={session}>
        {children}
      </CreatorsDashboardLayoutContainer>
    </HydrationBoundary>
  );
}
