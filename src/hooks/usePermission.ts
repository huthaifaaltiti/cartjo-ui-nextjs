import { useAuthContext } from "@/hooks/useAuthContext";
import { Permission } from "@/enums/permission.enum";
import { hasRequiredPermissionsClientSide } from "@/utils/session-access.utils";

export const usePermission = <T extends string>(
  permissionMap: Record<T, Permission | Permission[]>,
) => {
  const { isSessionLoading, isAuthenticated, session } = useAuthContext();

  // Dynamically map over the object keys provided by the component
  const permissionsKeys = Object.keys(permissionMap) as T[];

  const actionsMap = permissionsKeys.reduce(
    (acc, key) => {
      const required = permissionMap[key];
      const requiredArray = Array.isArray(required) ? required : [required];

      acc[key] = hasRequiredPermissionsClientSide({
        requiredPermissions: requiredArray,
        sessionPermissions: session?.permissions ?? null,
      });

      return acc;
    },
    {} as Record<T, boolean>,
  );

  return {
    isSessionLoading,
    isAuthenticated,
    ...actionsMap,
  };
};
