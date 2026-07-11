import BannersPageHeader from "@/components/admin/routes/banners/BannersPageHeader";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { getModulePathname, requireRoutePermissions } from "@/lib/access-route";
import { getSession } from "@/lib/session.server";
import { getAccessToken } from "@/lib/tokens.server";
import { requireAuth } from "@/utils/authRedirect";

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const token = await getAccessToken();

  const pathname = getModulePathname(DashboardModule.BANNERS);

  requireAuth(token);
  requireRoutePermissions({
    session,
    pathname: pathname ?? "/dashboard/banners",
    redirectTo: "/dashboard",
  });

  return (
    <div className="w-full h-full">
      <BannersPageHeader />
      {children}
    </div>
  );
}
