import { redirect } from "next/navigation";
import { getSession } from "@/lib/session.server";
import { getAccessToken } from "@/lib/tokens.server";
import { DashboardModule } from "@/enums/dashboard-module.enum";
import { ROUTE_PERMISSIONS } from "@/config/route-permissions";
import { hasRequiredPermissionsServerSide } from "@/utils/session-access.utils";
import { requireAuth } from "@/utils/authRedirect";

export async function guardRoute(module: DashboardModule) {
  const [session, token] = await Promise.all([getSession(), getAccessToken()]);

  requireAuth(token);

  const required = ROUTE_PERMISSIONS[module];
  if (required) {
    const requiredArray = Array.isArray(required) ? required : [required];
    const allowed = hasRequiredPermissionsServerSide({
      requiredPermissions: requiredArray,
      sessionPermissions: session?.permissions ?? null,
    });

    if (!allowed) {
      redirect("/403");
    }
  }

  return { session, token };
}
