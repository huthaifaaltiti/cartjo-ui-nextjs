import { MapPin, Users, Box, Boxes, ShoppingBasket } from "lucide-react";
import { useTranslations } from "next-intl";

export function useDashboardNavLinks() {
  const t = useTranslations();

  const navLinks = [
    {
      label: t(
        "routes.dashboard.components.DashboardControlNavLinks.navItems.locations"
      ),
      href: "/dashboard/locations",
      icon: MapPin,
    },
    {
      label: t(
        "routes.dashboard.components.DashboardControlNavLinks.navItems.users"
      ),
      href: "/dashboard/users",
      icon: Users,
    },
    {
      label: t(
        "routes.dashboard.components.DashboardControlNavLinks.navItems.categories"
      ),
      href: "/dashboard/categories",
      icon: Box,
    },
    {
      label: t(
        "routes.dashboard.components.DashboardControlNavLinks.navItems.subCategories"
      ),
      href: "/dashboard/sub-categories",
      icon: Boxes,
    },
    {
      label: t(
        "routes.dashboard.components.DashboardControlNavLinks.navItems.products"
      ),
      href: "/dashboard/products",
      icon: ShoppingBasket,
    },
  ];

  return navLinks;
}
