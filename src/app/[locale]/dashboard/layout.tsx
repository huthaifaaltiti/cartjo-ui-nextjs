import { getServerSession } from "next-auth/next";

import { ExtendedSession } from "@/types/session";
import { authOptions } from "@/lib/authOptions";

import DashboardSideNav from "@/components/admin/layout/DashboardSideNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = (await getServerSession(authOptions)) as ExtendedSession;
  const canManage = session?.user?.canManage ?? false;

  return (
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
  );
}
