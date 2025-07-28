import { useTranslations } from "next-intl";
import { dashboardNavLinks } from "@/config/dashboardNavLinks.config";

export function useDashboardNavLinks() {
  const t = useTranslations();

  return dashboardNavLinks.map((item) => ({
    label: t(item.labelKey),
    href: item.href,
    icon: item.icon,
  }));
}
