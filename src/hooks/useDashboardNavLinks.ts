import { useTranslations } from "next-intl";
import { dashboardNavLinks } from "@/config/dashboardNavLinks.config";
import { useAuthContext } from "./useAuthContext";
import { Permission } from "@/enums/permission.enum";

export function useDashboardNavLinks() {
  const t = useTranslations();
  const { session } = useAuthContext();
  const sessionPermissions = session?.permissions ?? [];

  return dashboardNavLinks
    .filter((dnl) => {
      const dashboardNavLinkPermissions = dnl.permissions;
      const hasOverlap = sessionPermissions.some((p) =>
        dashboardNavLinkPermissions?.includes(p as Permission),
      );

      return hasOverlap;
    })
    .map((item) => ({
      label: t(item.labelKey),
      href: item.href,
      icon: item.icon,
    }));
}
