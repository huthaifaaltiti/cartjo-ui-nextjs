import { useTranslations, useLocale } from "next-intl";
import { creatorDashboardNavLinks } from "@/config/creatorDashboardNavLinks.config";

export function useCreatorDashboardNavLinks() {
  const t = useTranslations();
  const locale = useLocale();

  return creatorDashboardNavLinks.map((item) => ({
    label: t(item.labelKey),
    href: `/${locale}${item.href}`,
    rawHref: item.href,
    icon: item.icon,
    isCompleted: item.isCompleted,
  }));
}
