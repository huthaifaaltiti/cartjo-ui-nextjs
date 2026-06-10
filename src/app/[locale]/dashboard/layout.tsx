import DashboardSideNav from "@/components/admin/layout/DashboardSideNav";
import { getSession, checkIsAdmin } from "@/lib/session.server";
import { getQueryClient } from "@/utils/queryUtils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { PageProps } from "@/types/common";
import { redirect } from "next/navigation";
import { prefetchActiveLogo } from "@/services/prefetch/activeLogo";

export default async function DashboardLayout({
  children,
  params,
}: PageProps & {
  children: React.ReactNode;
}) {
  const { locale } = await params;

  const session = await getSession();

  const canManage = checkIsAdmin(session);

  if (!session || !canManage) redirect("/");

  const queryClient = getQueryClient();

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
