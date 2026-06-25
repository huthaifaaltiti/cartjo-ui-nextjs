import UsersPageHeader from "@/components/admin/routes/users/UsersPageHeader";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { getModulePathname, requireRoutePermissions } from "@/lib/access-route";
import { getSession } from "@/lib/session.server";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";

export default async function UsersPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const token = await getAccessToken();

  const pathname = getModulePathname(DashboardModule.USERS);

  requireAuth(token);
  requireRoutePermissions({
    session,
    pathname: pathname ?? "/dashboard/users",
    redirectTo: "/dashboard",
  });

  return (
    <div className="w-full h-full">
      <UsersPageHeader />
      {children}
    </div>
  );
}
