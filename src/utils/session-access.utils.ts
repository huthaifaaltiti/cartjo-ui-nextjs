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

interface HasRequiredPermissionsParams {
  requiredPermissions: string[];
  sessionPermissions: string[] | null;
}

export function hasRequiredPermissionsClientSide({
  sessionPermissions,
  requiredPermissions,
}: HasRequiredPermissionsParams): boolean {
  if (!sessionPermissions) return false;

  return requiredPermissions.every((perm) => sessionPermissions.includes(perm));
}

export function hasRequiredPermissionsServerSide({
  requiredPermissions,
  sessionPermissions,
}: HasRequiredPermissionsParams): boolean {
  // No permissions required -> always allowed
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // No session permissions available -> deny
  if (!sessionPermissions || sessionPermissions.length === 0) {
    return false;
  }

  const sessionPermissionsSet = new Set(sessionPermissions);

  // ANY one required permission is enough
  return requiredPermissions.some((permission) =>
    sessionPermissionsSet.has(permission),
  );
}
