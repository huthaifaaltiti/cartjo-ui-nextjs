import DashboardSideNav from "@/components/admin/layout/DashboardSideNav";
import { checkIsAdmin, checkCanAccessDashboard } from "@/lib/session.server";
import { getQueryClient } from "@/utils/queryUtils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { guardRoute } from "@/lib/route-guard.server";
import { AppRoute } from "@/enums/app-route.enum";

interface NextLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: NextLayoutProps) {
  const { locale } = await params;

  const { session } = await guardRoute(AppRoute.DASHBOARD);

  const isAdmin = checkIsAdmin(session);
  const canAccessDashboard = checkCanAccessDashboard(session);
  const canManage = isAdmin && canAccessDashboard;
  if (!session || !canManage) redirect("/");

  const queryClient: QueryClient = getQueryClient();

  await prefetchActiveLogo({ queryClient, locale });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="w-full min-h-screen bg-[#f5f4fe]">
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
          {canManage && (
            <div className="w-full flex-none md:w-64">
              <DashboardSideNav />
            </div>
          )}
          <div
            className={`flex-grow md:overflow-y-auto md:p-3 ${
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
