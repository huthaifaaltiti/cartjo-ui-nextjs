import DashboardSideNav from "@/components/admin/layout/DashboardSideNav";
import {
  getSession,
  checkIsAdmin,
  checkCanAccessDashboard,
} from "@/lib/session.server";
import { getQueryClient } from "@/utils/queryUtils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";

interface NextLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({
  children,
  params,
}: NextLayoutProps) {
  const { locale } = await params;

  const session = await getSession();
  const token = await getAccessToken();

  requireAuth(token);

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
