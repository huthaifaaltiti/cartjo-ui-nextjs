import { Permission } from "@/enums/permission.enum";
import { UserRole } from "@/enums/user-role.enum";
import { CartJOSession } from "@/types/cartjoSession.type";
import { TokenSession } from "@/types/tokenSession.type";

export function isAdminClientSide(
  session: CartJOSession | TokenSession | null,
): boolean {
  if (!session) return false;

  const role = session.role.toLowerCase();

  return (
    role === UserRole.ADMINISTRATOR.toLocaleLowerCase() ||
    role === UserRole.OWNER.toLocaleLowerCase()
  );
}

export function checkCanAccessDashboardClientSide(
  session: CartJOSession | TokenSession | null,
): boolean {
  if (!session) return false;

  const userPermissions: string[] = session.permissions ?? [];

  return userPermissions.includes(Permission.DASHBOARD_ACCESS) ?? false;
}

export function hasRequiredPermissionsClientSide({
  sessionPermissions,
  requiredPermissions,
}: {
  sessionPermissions: string[] | null | undefined;
  requiredPermissions: string[];
}): boolean {
  if (!sessionPermissions) return false;

  return requiredPermissions.every((perm) => sessionPermissions.includes(perm));
}
