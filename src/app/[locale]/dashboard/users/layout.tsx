import UsersPageHeader from "@/components/admin/routes/users/UsersPageHeader";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { guardRoute } from "@/lib/route-guard.server";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await guardRoute(DashboardModule.USERS);

  return (
    <div className="w-full h-full">
      <UsersPageHeader />
      {children}
    </div>
  );
}
