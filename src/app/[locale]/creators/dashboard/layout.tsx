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
import CreatorDashboardSideNav from "@/components/creators/dashboard/CreatorDashboardSideNav";

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
      <div className="w-full h-screen overflow-hidden bg-[#f5f4fe]">
        <div className="flex h-full flex-col md:flex-row">
          {canManage && (
            <div className="w-full flex-none md:w-64">
              <CreatorDashboardSideNav />
            </div>
          )}
          <div
            className={`flex-1 min-h-0 overflow-y-auto p-3 md:p-4 ${
              !canManage ? "w-full" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}
