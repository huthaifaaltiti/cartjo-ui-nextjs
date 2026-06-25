import { redirect } from "next/navigation";
import { Permission } from "@/enums/permission.enum";
import { dashboardNavLinks } from "@/config/dashboardNavLinks.config";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { AuthSession } from "@/types/common";

function getRoutePermissions(pathname: string): Permission[] {
  const route = dashboardNavLinks.find((r) => pathname.startsWith(r.href));

  return route?.permissions ?? [];
}

export function requireRoutePermissions(params: {
  session: AuthSession;
  pathname: string;
  redirectTo?: string;
}) {
  const { session, pathname, redirectTo = "/dashboard" } = params;

  if (!session) {
    redirect("/auth");
  }

  const userPermissions = session.permissions ?? [];
  const requiredPermissions = getRoutePermissions(pathname);

  // if route has no permissions defined → allow
  if (requiredPermissions.length === 0) return;

  const hasAccess = requiredPermissions.some((p) =>
    userPermissions.includes(p),
  );

  if (!hasAccess) {
    redirect(redirectTo);
  }
}

export function getModulePathname(module: DashboardModule): string | undefined {
  return dashboardNavLinks.find((item) => item.name === module)?.href;
}
